import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { map, catchError, tap } from 'rxjs/operators';
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(_http, _config) {
        this._http = _http;
        this._config = _config;
        this.isLoggedIn = false;
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        this.actionUrl = "" + this._config.apiUrl + this._config.loginEndpoint;
        this._token = localStorage.getItem('token') || '';
    }
    AuthenticationService.prototype.login = function (credentials) {
        var _this = this;
        var toAdd = JSON.stringify(credentials);
        return this._http.post(this.actionUrl + "/login", toAdd, this.httpOptions)
            .pipe(map(function (response) { return response; }), catchError(this.handleError), tap(function (response) {
            if (response.id !== undefined) {
                _this.isLoggedIn = true;
                _this._token = response.id;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', response.userId || '');
                localStorage.setItem('created', response.created || '');
                localStorage.setItem('token', response.id);
            }
            return response;
        }));
    };
    AuthenticationService.prototype.changePassword = function (credentials) {
        var newValues = {
            oldPassword: credentials.password,
            newPassword: credentials.repassword
        };
        var toAdd = JSON.stringify(newValues);
        return this._http.post(this.actionUrl + "/change-password?access_token=" + this._token, toAdd, this.httpOptions)
            .pipe(map(function (response) { return response; }), catchError(this.handleError), tap(function (response) {
            return response;
        }));
    };
    AuthenticationService.prototype.register = function (credentials) {
        var toAdd = JSON.stringify(credentials);
        return this._http.post(this.actionUrl + "/", toAdd, this.httpOptions)
            .pipe(map(function (response) { return response; }), catchError(this.handleError), tap(function (response) {
            return response;
        }));
    };
    AuthenticationService.prototype.logout = function () {
        this.isLoggedIn = false;
        this._token = '';
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('created');
        console.log('logout', 'Has cerrado sesión correctamente');
    };
    AuthenticationService.prototype.token = function () {
        return this._token;
    };
    AuthenticationService.prototype.isAuthenticated = function () {
        if (this.isLoggedIn) {
            return true;
        }
        else {
            return false;
        }
    };
    AuthenticationService.prototype.handleError = function (error) {
        console.log(error);
        return Observable.throw(error || 'Server error');
    };
    AuthenticationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AuthenticationService.ctorParameters = function () { return [
        { type: HttpClient, },
        { type: ConfigService, },
    ]; };
    return AuthenticationService;
}());
export { AuthenticationService };
//# sourceMappingURL=authentication.service.js.map