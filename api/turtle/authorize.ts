import { graphql } from 'graphql';
import * as getFields from 'graphql-fields';
import request from 'graphql-request';
import { appConfig } from '../services/config-repository';
import cache from './cache';

const getTypeName = str => JSON.stringify(str).replace(/[^a-zA-Z ]/g, '');

const getRequestedOpsFromSelections = (fields, parentTypeName, agg) => {
  const fieldsQueryableOnParentType = appConfig.types.find(type => type.name === parentTypeName);
  for (const fieldName in fields) {
    agg.push(`${parentTypeName}-${fieldName}`);
    const fieldType = fieldsQueryableOnParentType.fields.find(f => f.name === fieldName).type;
    getRequestedOpsFromSelections(fields[fieldName], fieldType, agg);
  }
};

const evaluate = (ruleDefinition, requestor, request): Promise<{ pass: boolean }> => { // tslint:disable-line
  return new Promise(async (resolve, reject) => {
    try {
      const handler = eval(`(function() {
          const exports = {};
          ${ruleDefinition};
          return exports.handler;
        })();
      `);
      const res = handler(requestor, request, appConfig.requestArgs);

      // means the result is a promise and we need to wait for it
      if (res.then) {
        try {
          const resolvedRes = await res;
          resolve({ pass: resolvedRes });
        } catch (err) {
          reject(err);
        }
      } else {
        resolve({ pass: res });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const authorize = async (query: string, requestor: object) => {
  graphql(appConfig.schema, query);
  const { resolveInfo: info } = appConfig;

  const requestedOps = [`${info.parentType}-${info.fieldName}`, `Type-${getTypeName(info.returnType)}`];
  getRequestedOpsFromSelections(getFields(info), getTypeName(info.returnType), requestedOps);

  const setOfRuleNamesToCheck = new Set();
  requestedOps.forEach(requestedOp => {
    const rulesForOp = appConfig.config.activeRules[requestedOp];
    if (rulesForOp) {
      rulesForOp.forEach(ruleName => setOfRuleNamesToCheck.add(ruleName));
    }
  });
  const ruleNamesToCheck = Array.from(setOfRuleNamesToCheck);
  const rulesToCheck = appConfig.config.availableRules.filter(rule => ruleNamesToCheck.includes(rule.name));

  const ruleResults = await Promise.all(
    rulesToCheck.map(rule =>
      evaluate(rule.ruleDefinition, requestor, request)
        .then(res => ({ pass: res.pass, ruleName: rule.name }))
        .catch(err => ({
          err: err.message,
          pass: false,
          ruleName: rule.name
        }))
    )
  );
  if (ruleResults.some(result => !result.pass)) {
    return { pass: false, failedRules: ruleResults.filter(rule => !rule.pass) };
  }
  return { pass: true };
};
