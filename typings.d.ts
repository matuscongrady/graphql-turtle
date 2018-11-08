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

enum FieldKind {
  SCALAR = 'SCALAR',
  NON_NULL = 'NON_NULL',
  INPUT_OBJECT = 'INPUT_OBJECT',
  OBJECT = 'OBJECT',
  LIST = 'LIST'
}

interface FieldType {
  kind: FieldKind;
  name?: string;
  ofType?: FieldType;
}

interface SchemaIntrospection {
  __schema: {
    types: {
      fields?: {
        name: string;
        type: FieldType;
      }[];
      kind: string;
      name: string;
      possibleTypes?: null;
    }[];
  };
}

interface HTMLElementRef extends HTMLElement {
  reset(): void;
  execute(): void;
}
