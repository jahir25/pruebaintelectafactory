sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;
    return BaseController.extend("sap.ui.entelantenas.controller.NuevoSitio", {
        onInit : function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("nuevoSitio").attachMatched(function(oEvent) {
                that.fieldsClear();
                this.getcheckSession();
            }, this);
        },
        onPressBack: function(oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuSitio");
        },
        OnPressLogout: function(){            
            var oRouter = this.getOwnerComponent().getRouter();
            $.ajax({
                url: 'model/logout.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    oRouter.navTo("login");
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){   
                } 
            });
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
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){  
                } 
            });
        },
        onPressSave:function(){
            var oRouter = this.getOwnerComponent().getRouter();            
            var codigo = this.getView().byId("codigo").getValue();
            var nombre = this.getView().byId("nombre").getValue();
            var latitud = this.getView().byId("latitud").getValue();
            var longitud = this.getView().byId("longitud").getValue();
            var latitude = /^[-|+]?[0-9]{0,2}(.[0-9]{0,6})?$/;
            var longitude = /^[-|+]?[0-9]{0,3}(.[0-9]{0,6})?$/;
            var findSuccess = 0;            
            
            if(codigo.length > 0) findSuccess += 1; else findSuccess -=1;            
            if(nombre.length > 0) findSuccess += 1; else findSuccess -=1;
            
            if(latitud.match(latitude) && latitud <= 90 && latitud >= -90 && latitud.length > 0)
                findSuccess += 1;
            else{
                MessageBox.error("Ingrese un valor correcto en el campo latitud");
                findSuccess -= 1;
            }
            
            if(longitud.match(longitude) && longitud <= 180 && longitud >= -180 && longitud.length > 0)
                findSuccess += 1;
            else{
                MessageBox.error("Ingrese un valor correcto en el campo longitud");
                findSuccess -= 1;
            }
            
            var json = {
                data: {
                    "codigo" : codigo,
                    "nombre" : nombre,
                    "latitud" : latitud,
                    "longitud" : longitud                    
                },
                action: 1
            };
            
            if(findSuccess == 4){
                sap.ui.core.BusyIndicator.show(0);
                $.ajax({
                    url: 'model/crudSitio.php',
                    cache: false,
                    timeout: 5000,
                    type: "POST",
                    data: JSON.stringify(json),
                    success: function(result, status, xhr){
                        result = JSON.parse(result);
                        
                        if(result.type == "s"){
                            sap.m.MessageBox.success(result.success,{
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function(oAction) {
                                    that.fieldsClear();
                                    oRouter.navTo("menuSitio");
                                }
                            });
                        }else{
                            sap.m.MessageBox.error(result.error);
                        }
                    },
                    error: function(xhr, status, error){
                        MessageBox.error("Error de Conexion");
                    },
                    complete: function(){
                        sap.ui.core.BusyIndicator.hide();
                    } 
                });            
            }else{
                if(findSuccess == 0){
                    MessageBox.error("Completar los campos correctamente");                   
                }
            }
        },
        fieldsClear: function(){
            that.getView().byId("codigo").setValue("");
            that.getView().byId("nombre").setValue("");
            that.getView().byId("latitud").setValue("");
            that.getView().byId("longitud").setValue("");
        }
    });
});