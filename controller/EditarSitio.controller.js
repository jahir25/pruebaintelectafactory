sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;    
    return BaseController.extend("sap.ui.entelantenas.controller.EditarSitio", {
        onInit : function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("editarSitio").attachMatched(function(oEvent) {
                var sitio = oEvent.getParameter("arguments").codigo;                
                sitio = window.atob(sitio);
                this.getcheckSession();
                sap.ui.core.BusyIndicator.show(0);                
                this.getSitio(sitio);                
            }, this);
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
        getSitio: function(codigo){            
            var json = {"data": codigo, "action": 3};            
            sap.ui.core.BusyIndicator.show(0);
            $.ajax({
                url: 'model/crudSitio.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                    result = JSON.parse(result);

                    that.getView().byId("codigo").setValue(result.codigo_sitio);
                    that.getView().byId("nombre").setValue(result.nombre_sitio);
                    that.getView().byId("latitud").setValue(result.latitud);
                    that.getView().byId("longitud").setValue(result.longitud);                                        
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },
        onPressBack: function(oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("listarSitio");
        },
        onPressSave:function(){
            var oRouter = that.getOwnerComponent().getRouter();            
            var codigo = that.getView().byId("codigo").getValue();
            var nombre = that.getView().byId("nombre").getValue();
            var latitud = that.getView().byId("latitud").getValue();
            var longitud = that.getView().byId("longitud").getValue();
            var latitude = /^[-|+]?[0-9]{0,2}(.[0-9]{0,6})?$/;
            var longitude = /^[-|+]?[0-9]{0,3}(.[0-9]{0,6})?$/;
            var findSuccess = 0;            
            
            if(codigo.length > 0) findSuccess += 1; else findSuccess -=1;            
            if(nombre.length > 0) findSuccess += 1; else findSuccess -=1;
            
            if(latitud.match(latitude) && latitud <= 90 && latitud >= -90)
                findSuccess += 1;
            else{
                MessageBox.error("Ingrese un valor correcto en el campo latitud");
                findSuccess -= 1;
            }
            
            if(longitud.match(longitude) && longitud <= 180 && longitud >= -180)
                findSuccess += 1;
            else{
                MessageBox.error("Ingrese un valor correcto en el campo longitud");
                findSuccess -= 1;
            }
            
            var json = {
                "data": {
                    "codigo" : codigo,
                    "nombre" : nombre,
                    "latitud" : latitud,
                    "longitud" : longitud
                },
                "action": 4
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

                        that.getView().byId("codigo").setValue("");
                        that.getView().byId("nombre").setValue("");
                        that.getView().byId("latitud").setValue("");
                        that.getView().byId("longitud").setValue("");

                        if(result.type == "s"){
                            sap.m.MessageBox.success(result.success,{
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function(oAction) {
                                    oRouter.navTo("listarSitio");
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
                MessageBox.error("Completar los campos correctamente")
            }
        }
    });
});