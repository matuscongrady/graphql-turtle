export interface QueryField {
  name: string;
  type: string;
  isList: boolean;
}

export function getQueryFields(introspection: SchemaIntrospection): QueryField[] {
  const queryType = introspection.__schema.types.find(t => t.name === 'Query');
  return queryType.fields
    .filter(field => !field.name.startsWith('_') && field.name !== 'node')
    .map(field => {
      if (field.type.kind === 'OBJECT' && field.name) {
        return { name: field.name, type: field.type.name, isList: false };
      }
      if (field.type.kind === 'NON_NULL' && field.type.ofType.kind === 'LIST') {
        return { name: field.name, type: field.type.ofType.ofType.ofType.name, isList: true };
      }
    })
    .filter(f => f);
}
