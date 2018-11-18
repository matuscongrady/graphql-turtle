export interface TypeField extends BaseTypeInfo {
  fields: BaseTypeInfo[];
}

function getTypeName(type: SchemaFieldType): string {
  if (type.kind === 'ENUM') return `ENUM - ${type.name}`;
  if ((type.kind === 'OBJECT' && !type.ofType) || type.kind === 'SCALAR') return type.name;
  if (type.ofType.kind === 'OBJECT') return type.ofType.name;
  return type.ofType.name;
}

function getTypeInfo(field): BaseTypeInfo {
  const isNonNull = field.type.kind === 'NON_NULL';
  const isList = field.type.kind === 'LIST';
  return {
    isNonNull,
    isList,
    name: field.name,
    type: isNonNull || isList ? getTypeName(field.type.ofType) : getTypeName(field.type)
  };
}

export function getTypes(introspection: SchemaIntrospection): TypeField[] {
  const res = introspection.__schema.types
    .filter(type => !type.name.startsWith('__') && type.kind === 'OBJECT')
    .map(type => {
      return {
        name: type.name,
        type: type.name,
        isList: false,
        fields: type.fields.filter(t => t.type.kind !== 'INTERFACE').map(getTypeInfo)
      };
    });
  return res;
}

export function getFieldsForType(introspection: SchemaIntrospection, type: string): TypeField[] {
  const queryType = introspection.__schema.types.find(t => t.name === type);
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
          fields: introspection.__schema.types.find(type => type.name === typeInfo.type).fields.map(getTypeInfo)
        };
      }
    })
    .filter(f => f);
}
