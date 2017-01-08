export const cache = (state: any = {}, {type, payload}) => {
  let index: number;
  switch (type) {
    case 'LOAD_CACHE':
      if(payload.cache) {
        payload['keys'] = Object.keys(payload.cache);}
      return payload;
   default:
      return state;
  }
};

export const sphere = (state: any = {}, {type, payload}) => {
  let index: number;
  switch (type) {
    case 'LOAD_SPHERE':
      // Add list of keys
      if(payload.sphere) {
        payload['keys'] = Object.keys(payload.sphere);}
      return payload;
    default:
      return state;
  }
};

export const events = (state: any = {}, {type, payload}) => {
  let index: number;
  switch (type) {
    case 'LOAD_EVENTS':
      if(payload.events) {
        payload['keys'] = Object.keys(payload.events);}
      return payload;
   default:
      return state;
  }
};

export const medias = (state: any = {}, {type, payload}) => {
  let index: number;
  switch (type) {
    case 'LOAD_MEDIAS':
      if(payload.medias) {
        payload['keys'] = Object.keys(payload.medias);}
      return payload;
   default:
      return state;
  }
};