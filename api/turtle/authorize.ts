import { graphql } from 'graphql';
import * as getFields from 'graphql-fields';
import { appConfig } from '../services/config-repository';

const getTypeName = str => JSON.stringify(str).replace(/[^a-zA-Z ]/g, '');

const getRequestedOpsFromSelections = (fields, parentTypeName, agg) => {
  const fieldsQueryableOnParentType = appConfig.types.find(type => type.name === parentTypeName);
  for (const fieldName in fields) {
    agg.push(`${parentTypeName}-${fieldName}`);
    const fieldType = fieldsQueryableOnParentType.fields.find(f => f.name === fieldName).type;
    getRequestedOpsFromSelections(fields[fieldName], fieldType, agg);
  }
};

const evaluate = ruleDefinition => {
  return new Promise(async (resolve, reject) => {
    try {
      const exports = { handler: () => Promise.resolve(true) };
      eval(ruleDefinition);
      const res = exports.handler();
      // means the result is promise and we need to await it
      if (res.then) {
        const resolvedRes = await res;
        resolve(resolvedRes);
      } else {
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const authorize = async (query: string, _requestor: object) => {
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
  const rulesToCheck = appConfig.config.availableRules
    .filter(rule => ruleNamesToCheck.includes(rule.name))
    .map(rule => rule.ruleDefinition);

  const ruleResults = await Promise.all(rulesToCheck.map(evaluate));
};
