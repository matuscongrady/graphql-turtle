import { DocumentNode } from 'graphql';

export const authorize = (query: DocumentNode, requestor: object, config: TurtleConfig) => {
  console.log(query);
  console.log(requestor);
  console.log(config);
};
