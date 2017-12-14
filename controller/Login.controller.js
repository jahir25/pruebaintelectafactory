sap.ui.define([
    "sap/ui/entelantenas/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    'sap/m/Button',
    'sap/m/Dialog',
    'sap/m/Text'
], function (BaseController, JSONModel, MessageToast, Button, Dialog, Text) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.Login", {
        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("login").attachMatched(function(oEvent){
                thes.getcheckSession();
                setTimeout(function() {
                    thes.onClearInput();
                }, 500);
            }, this);
        },        
        goTo: function(oEvent, index) {
            var oRouter = this.getOwnerComponent().getRouter();
            switch(index){
                case 1:   
                    oRouter.navTo("menuUsuario");
                    break;
                case 2:   
                    oRouter.navTo("menuParametro");                
                    break;                
                default:
                    break;
            }
        },
        onUsuario: function(oEvent){
            this.goTo(oEvent, 1);
        },
        onParametro: function(oEvent){
            this.goTo(oEvent, 2);
        },
        onClearInput: function(){
            console.log("entro");
            var thes = this;
            thes.getView().byId("login").setValue("");
            thes.getView().byId("pass").setValue("");
        },
        onPressLogin: function(oEvent){
            var login = this.getView().byId("login").getValue();
            var pass = this.getView().byId("pass").getValue();
            if (login != '' && pass != '') {
                var thes = this;
                var oRouter = this.getOwnerComponent().getRouter();
                var Parameters = {
                    'login' : btoa(login),
                    'pass' : btoa(pass),
                };
                $.ajax({
                    url: 'model/checkLogin.php',
                    cache: false,
                    timeout: 5000,
                    type: "GET",
                    data: Parameters,
                    success: function(result, status, xhr){

                        if (JSON.parse(result).acceso == "true") {
                            oRouter.navTo(JSON.parse(result).route);
                        }
                        else if(JSON.parse(result).acceso == "false"){
                            oRouter.navTo(JSON.parse(result).route);
                            var dialog = new Dialog({
                                title: 'Error',
                                type: 'Message',
                                state: 'Error',
                                content: new Text({
                                    text: 'Usuario y contraseña incorrectos o su usuario esta desactivado.'
                                }),
                                beginButton: new Button({
                                    text: 'OK',
                                    press: function () {
                                        dialog.close();
                                    }
                                }),
                                afterClose: function() {
                                    dialog.destroy();
                                }
                            });

                            dialog.open();
                        }
                    },
                    error: function(xhr, status, error){
                        sap.m.MessageBox.error("Error de Conexion");
                    },
                    complete: function(){
                        
                    } 
                });
            }
            else{
                var dialog = new Dialog({
                    title: 'Error',
                    type: 'Message',
                    state: 'Error',
                    content: new Text({
                        text: 'Usuario y/o contraseña incorrectos.'
                    }),
                    beginButton: new Button({
                        text: 'OK',
                        press: function () {
                            dialog.close();
                        }
                    }),
                    afterClose: function() {
                        dialog.destroy();
                    }
                });
                dialog.open();
            }
        },
        getcheckSession: function(){
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            $.ajax({
                url: 'model/checkSession.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    if (JSON.parse(result).acceso == "false") {
                        oRouter.navTo("login");
                    }
                },
                error: function(xhr, status, error){
                    sap.m.MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
    });
});