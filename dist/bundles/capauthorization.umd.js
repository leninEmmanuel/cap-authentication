(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs'), require('rxjs/operators'), require('@angular/forms'), require('ionic-angular'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common/http', 'rxjs', 'rxjs/operators', '@angular/forms', 'ionic-angular', '@angular/common'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.capauthorization = {}),global.ng.core,null,null,null,null,null,null));
}(this, (function (exports,core,http,rxjs,operators,forms,ionicAngular,common) { 'use strict';

    var ConfigService = /** @class */ (function () {
        function ConfigService(config) {
            if (config) {
                this.apiUrl = config.apiUrl;
                this.loginEndpoint = config.loginEndpoint;
            }
        }
        ConfigService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        ConfigService.ctorParameters = function () { return [
            { type: ConfigService, decorators: [{ type: core.Optional },] },
        ]; };
        return ConfigService;
    }());

    var AuthenticationService = /** @class */ (function () {
        function AuthenticationService(_http, _config) {
            this._http = _http;
            this._config = _config;
            this.isLoggedIn = false;
            this.httpOptions = {
                headers: new http.HttpHeaders({
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
                .pipe(operators.map(function (response) { return response; }), operators.catchError(this.handleError), operators.tap(function (response) {
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
                .pipe(operators.map(function (response) { return response; }), operators.catchError(this.handleError), operators.tap(function (response) {
                return response;
            }));
        };
        AuthenticationService.prototype.register = function (credentials) {
            var toAdd = JSON.stringify(credentials);
            return this._http.post(this.actionUrl + "/", toAdd, this.httpOptions)
                .pipe(operators.map(function (response) { return response; }), operators.catchError(this.handleError), operators.tap(function (response) {
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
            return rxjs.Observable.throw(error || 'Server error');
        };
        AuthenticationService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        AuthenticationService.ctorParameters = function () { return [
            { type: http.HttpClient, },
            { type: ConfigService, },
        ]; };
        return AuthenticationService;
    }());

    var AuthRegisterComponent = /** @class */ (function () {
        function AuthRegisterComponent(authenticationService, formBuilder) {
            this.authenticationService = authenticationService;
            this.formBuilder = formBuilder;
            this.submit = new core.EventEmitter();
            this.changePage = new core.EventEmitter();
            this.credentials = {
                email: '',
                password: '',
                repassword: ''
            };
        }
        AuthRegisterComponent.prototype.ngOnInit = function () {
            this.registerform = this.formBuilder.group({
                password: ['', [forms.Validators.required, forms.Validators.minLength(3)]],
                repassword: ['', [forms.Validators.required, forms.Validators.minLength(3)]],
                email: ['', [forms.Validators.required, forms.Validators.minLength(3)]]
            });
        };
        AuthRegisterComponent.prototype.onSubmit = function () {
            var _this = this;
            if (this.credentials.password !== this.credentials.repassword) {
                console.log('passwords must be equal');
                return false;
            }
            this.authenticationService
                .register(this.credentials)
                .subscribe(function (result) {
                _this.submit.emit(result);
            });
        };
        AuthRegisterComponent.prototype.loginAccount = function () {
            this.changePage.emit(true);
        };
        AuthRegisterComponent.decorators = [
            { type: core.Component, args: [{
                        selector: "auth-app-register",
                        template: "\n    <ion-list>\n        <form [formGroup]=\"registerform\" (ngSubmit)=\"onSubmit()\">\n\n            <ion-item>\n                <ion-label stacked primary>Email</ion-label>\n                <ion-input [(ngModel)]=\"credentials.email\" formControlName=\"email\"\n                        type=\"text\" id=\"email\" spellcheck=\"false\" autocapitalize=\"off\" ngDefaultControl>\n                </ion-input>\n            </ion-item>\n            \n            <ion-item>\n                <ion-label stacked primary>Password</ion-label>\n                <ion-input [(ngModel)]=\"credentials.password\" formControlName=\"password\" type=\"text\" id=\"password\">\n                </ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label stacked primary>Repeat Password</ion-label>\n                <ion-input [(ngModel)]=\"credentials.repassword\" formControlName=\"repassword\" type=\"text\" id=\"repassword\">\n                </ion-input>\n            </ion-item>\n\n            <button ion-button type=\"submit\" block full primary [disabled]=\"!registerform.valid\">Register</button>\n            <button ion-button type=\"submit\" block secondary (click)=\"loginAccount()\">Login to account</button>\n\n        </form>\n    </ion-list>\n    ",
                        styles: [""],
                        encapsulation: core.ViewEncapsulation.Emulated
                    },] },
        ];
        /** @nocollapse */
        AuthRegisterComponent.ctorParameters = function () { return [
            { type: AuthenticationService, },
            { type: forms.FormBuilder, },
        ]; };
        AuthRegisterComponent.propDecorators = {
            "submit": [{ type: core.Output },],
            "changePage": [{ type: core.Output },],
        };
        return AuthRegisterComponent;
    }());

    var AuthLoginComponent = /** @class */ (function () {
        function AuthLoginComponent(authenticationService, formBuilder) {
            this.authenticationService = authenticationService;
            this.formBuilder = formBuilder;
            this.submit = new core.EventEmitter();
            this.changePage = new core.EventEmitter();
            this.credentials = {
                email: '',
                password: ''
            };
        }
        AuthLoginComponent.prototype.ngOnInit = function () {
            this.loginform = this.formBuilder.group({
                password: ['', [forms.Validators.required, forms.Validators.minLength(3)]],
                email: ['', forms.Validators.required]
            });
        };
        AuthLoginComponent.prototype.onSubmit = function () {
            var _this = this;
            this.authenticationService
                .login(this.credentials)
                .subscribe(function (result) {
                _this.submit.emit(result);
            });
        };
        AuthLoginComponent.prototype.createAccount = function () {
            this.changePage.emit(true);
        };
        AuthLoginComponent.decorators = [
            { type: core.Component, args: [{
                        selector: "auth-app-login",
                        template: "\n        <ion-list>\n            <form [formGroup]=\"loginform\" (ngSubmit)=\"onSubmit()\">\n\n            <ion-item>\n                <ion-label stacked primary>Email</ion-label>\n                <ion-input [(ngModel)]=\"credentials.email\" formControlName=\"email\"\n                        type=\"text\" id=\"email\" spellcheck=\"false\" autocapitalize=\"off\" ngDefaultControl>\n                </ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label stacked primary>Password</ion-label>\n                <ion-input [(ngModel)]=\"credentials.password\" formControlName=\"password\" type=\"text\" id=\"password\" ngDefaultControl>\n                </ion-input>\n            </ion-item>\n\n            <button ion-button type=\"submit\" block primary [disabled]=\"!loginform.valid\">Login</button>\n            <button ion-button type=\"submit\" block secondary (click)=\"createAccount()\">Create an account</button>\n\n            </form>\n        </ion-list>\n        ",
                        styles: [""],
                        encapsulation: core.ViewEncapsulation.Emulated
                    },] },
        ];
        /** @nocollapse */
        AuthLoginComponent.ctorParameters = function () { return [
            { type: AuthenticationService, },
            { type: forms.FormBuilder, },
        ]; };
        AuthLoginComponent.propDecorators = {
            "submit": [{ type: core.Output },],
            "changePage": [{ type: core.Output },],
        };
        return AuthLoginComponent;
    }());

    var AuthChangePasswordComponent = /** @class */ (function () {
        function AuthChangePasswordComponent(authenticationService, formBuilder) {
            this.authenticationService = authenticationService;
            this.formBuilder = formBuilder;
            this.submit = new core.EventEmitter();
            this.changePage = new core.EventEmitter();
            this.credentials = {
                password: '',
                repassword: ''
            };
            this.credentials = {
                password: '',
                repassword: ''
            };
        }
        AuthChangePasswordComponent.prototype.ngOnInit = function () {
            this.changeform = this.formBuilder.group({
                password: ['', [forms.Validators.required, forms.Validators.minLength(3)]],
                repassword: ['', [forms.Validators.required, forms.Validators.minLength(3)]]
            });
        };
        AuthChangePasswordComponent.prototype.onSubmit = function () {
            var _this = this;
            this.authenticationService
                .changePassword(this.changeform.value)
                .subscribe(function (result) {
                _this.submit.emit(result);
            });
        };
        AuthChangePasswordComponent.prototype.loginAccount = function () {
            this.changePage.emit(true);
        };
        AuthChangePasswordComponent.decorators = [
            { type: core.Component, args: [{
                        selector: "auth-app-change-password",
                        template: "\n        <ion-list>\n            <form [formGroup]=\"changeform\" (ngSubmit)=\"onSubmit()\">\n\n            <ion-item>\n                <ion-label stacked primary>Password</ion-label>\n                <ion-input [(ngModel)]=\"credentials.password\" formControlName=\"password\" type=\"text\" id=\"password\" ngDefaultControl>\n                </ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label stacked primary>Repeat Password</ion-label>\n                <ion-input [(ngModel)]=\"credentials.repassword\" formControlName=\"repassword\" type=\"text\" id=\"repassword\" ngDefaultControl>\n                </ion-input>\n            </ion-item>\n\n            <button ion-button type=\"submit\" block full primary [disabled]=\"!changeform.valid\">Change Password</button>\n            <button ion-button type=\"submit\" block secondary (click)=\"loginAccount()\">Login to account</button>\n\n            </form>\n        </ion-list>\n  ",
                        styles: [""],
                        encapsulation: core.ViewEncapsulation.Emulated
                    },] },
        ];
        /** @nocollapse */
        AuthChangePasswordComponent.ctorParameters = function () { return [
            { type: AuthenticationService, },
            { type: forms.FormBuilder, },
        ]; };
        AuthChangePasswordComponent.propDecorators = {
            "submit": [{ type: core.Output },],
            "changePage": [{ type: core.Output },],
        };
        return AuthChangePasswordComponent;
    }());

    var AuthenticationModule = /** @class */ (function () {
        function AuthenticationModule() {
        }
        AuthenticationModule.forRoot = function (config) {
            return {
                ngModule: AuthenticationModule,
                providers: [
                    {
                        provide: ConfigService,
                        useValue: config
                    }
                ]
            };
        };
        AuthenticationModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            AuthLoginComponent,
                            AuthRegisterComponent,
                            AuthChangePasswordComponent,
                        ],
                        imports: [
                            ionicAngular.IonicModule,
                            http.HttpClientModule,
                            forms.ReactiveFormsModule,
                            common.CommonModule,
                        ],
                        exports: [
                            http.HttpClientModule,
                            forms.ReactiveFormsModule,
                            common.CommonModule,
                            AuthLoginComponent,
                            AuthRegisterComponent,
                            AuthChangePasswordComponent,
                        ],
                        providers: [
                            AuthenticationService
                        ],
                        schemas: [
                            core.CUSTOM_ELEMENTS_SCHEMA
                        ]
                    },] },
        ];
        return AuthenticationModule;
    }());

    exports.AuthenticationModule = AuthenticationModule;
    exports.AuthenticationService = AuthenticationService;
    exports.AuthLoginComponent = AuthLoginComponent;
    exports.AuthRegisterComponent = AuthRegisterComponent;
    exports.AuthChangePasswordComponent = AuthChangePasswordComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
