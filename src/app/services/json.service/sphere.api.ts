import { Injectable }      from '@angular/core';

@Injectable()
export class SphereAPI {
proxy = 'https://localhost:8443/api';
  APIv  = '/v0.1';

  actions = {
    add_event:      { http: 'POST',     url: '/{{sphereName}}', body: `{"addEvent": {"name": "{{eventName}}"} }` },
    add_medias:     { http: 'UPLOAD',   url: '/{{sphereName}}/{{eventName}}' },
    add_sphere:     { http: 'PUT',      url: '/{{sphereName}}' },
    delete_sphere:  { http: 'DELETE',   url: '/{{sphereName}}' },
    get_device:     { http: 'GET',      url: '/device' },
    get_media:      { http: 'DOWNLOAD', url: '/{{sphereName}}/{{eventName}}/{{mediaName}}' },
    load_event:     { http: 'GET',      url: '/{{sphereName}}/{{eventName}}' },
    load_sphere:    { http: 'GET',      url: '/spheres' },
    load_cache:     { http: 'GET',      url: '/' },
    login:          { http: 'POST',     url: '/login', body: `
                        {"login": {
                            "username": "{{username}}",
                            "password": "{{password}}" } }` },
    logout:         { http: 'POST' },
    put_cache:      { http: 'PUT',    url: '/' },
    register:       { http: 'POST',   url: '/register', body: `
                        {"register": {
                            "username": "{{username}}",
                            "mail":     "{{mail}}",
                            "password": "{{password}}" } }` },
    newpassword:    { http: 'POST',   url: '/setpassword', body: `
                        {"setpassword": {
                            "username":    "{{username}}",
                            "newpassword": "{{newpassword}}",
                            "password":    "{{password}}" } }` }
 };
}
