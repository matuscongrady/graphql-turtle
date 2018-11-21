declare module '*.graphql' {
  const value: string;
  export default value;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

enum RootParentType {
  QUERY = 'Query',
  MUTATION = 'Mutation',
  TYPE = 'Type'
}

interface AvailableRule {
  name: string;
  ruleDefinition: string;
}

interface RuleUserProps {
  allAvailableRules: AvailableRule[];
  allActiveRulesMap: AllActiveRulesMap;
  setAllAvailableRules(allAvailableRules: AvailableRule[]);
  setAllActiveRulesMap(allActiveRulesMap: AllActiveRulesMap);
}

interface AllActiveRulesMap {
  [uniqeTypeFieldName: string]: string[];
}

interface ActiveRule {
  rule: string;
}

enum FieldKind {
  SCALAR = 'SCALAR',
  NON_NULL = 'NON_NULL',
  INPUT_OBJECT = 'INPUT_OBJECT',
  OBJECT = 'OBJECT',
  LIST = 'LIST',
  ENUM = 'ENUM',
  INTERFACE = 'INTERFACE'
}

interface BaseTypeInfo {
  name: string;
  type: string;
  isList: boolean;
  isNonNull?: boolean;
}

interface SchemaFieldType {
  kind: FieldKind;
  name?: string;
  ofType?: FieldType;
}

interface SchemaIntrospection {
  __schema: {
    types: {
      fields?: {
        name: string;
        description: string;
        type: FieldType;
      }[];
      name: string;
      kind: FieldKind;
      possibleTypes?: null;
    }[];
  };
}

interface HTMLElementRef extends HTMLElement {
  reset(): void;
  execute(): void;
}
