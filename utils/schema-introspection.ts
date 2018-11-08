export interface QueryField {
  name: string;
  type: string;
  isList: boolean;
  fields: {
    isNonNull: boolean;
    name: string;
    type: string;
  }[];
}

function getTypeInfo(type: FieldType): string {
  if ((type.kind === 'OBJECT' && !type.ofType) || type.kind === 'SCALAR') return type.name;
  if (type.ofType.kind === 'OBJECT') return type.ofType.name;
  return type.ofType.name;
}

function getTypeName(field) {
  const isNonNull = field.type.kind === 'NON_NULL';
  return {
    isNonNull,
    name: field.name,
    type: isNonNull ? getTypeInfo(field.type.ofType) : getTypeInfo(field.type)
  };
}

export function getQueryFields(introspection: SchemaIntrospection): QueryField[] {
  const queryType = introspection.__schema.types.find(t => t.name === 'Query');
  // console.log(introspection.__schema.types);
  return queryType.fields
    .filter(field => !field.name.startsWith('_') && field.name !== 'node')
    .map(field => {
      let typeInfo;
      if (field.type.kind === 'OBJECT' && field.name) {
        typeInfo = { name: field.name, type: field.type.name, isList: false };
      }
      if (field.type.kind === 'NON_NULL' && field.type.ofType.kind === 'LIST') {
        typeInfo = { name: field.name, type: field.type.ofType.ofType.ofType.name, isList: true };
      }
      if (typeInfo) {
        return {
          ...typeInfo,
          fields: introspection.__schema.types.find(type => type.name === typeInfo.type).fields.map(getTypeName)
        };
      }
    })
    .filter(f => f);
}
