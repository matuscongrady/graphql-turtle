export default {
  cachedResults: {},
  set(requestorObject, args, cacheValidity) {
    console.log(requestorObject, args, cacheValidity);
  }
};
