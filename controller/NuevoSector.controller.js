sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;
    return BaseController.extend("sap.ui.entelantenas.controller.NuevoSector", {
        onInit : function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("nuevoSector").attachMatched(function(oEvent) {
                that.getTecnologiaAndSitio();
                that.getcheckSession();
                that.getView().byId("sector").setValue("");
                that.getView().byId("slcSitio").setSelectedKey("");
                that.getView().byId("slcTecnologia").setSelectedKey("");
            }, this);
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
        onPressBack: function(oEvent) {      
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuSector");
        },
        getTecnologiaAndSitio: function(){
            var json = {
                data: {},
                action: 6
            };
            
            sap.ui.core.BusyIndicator.show(0);
            $.ajax({
                url: 'model/crudSector.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                    result = JSON.parse(result);                     
                    var sitio = new JSONModel(result[0]);
                    var tecnologia = new JSONModel(result[1]);
                    
                    that.getView().byId("slcSitio").setModel(sitio);
                    that.getView().byId("slcTecnologia").setModel(tecnologia);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    sap.ui.core.BusyIndicator.hide();
                }
            });
                        
        },
        onPressSave: function(){
            var oRouter = this.getOwnerComponent().getRouter();            
            var sector = that.getView().byId("sector").getValue();
            var sitio = this.getView().byId("slcSitio").getSelectedKey();
            var tecnologia = this.getView().byId("slcTecnologia").getSelectedKey();            
            var findSuccess = 0;            
            
            sap.ui.core.BusyIndicator.show(0);
            if(sector.length > 0){
                findSuccess += 1; 
            }else 
                findSuccess -=1;
            
            if(sitio.length > 0){
                findSuccess += 1;
            }else 
                findSuccess -=1;
            
            if(tecnologia > 0){
                findSuccess += 1;                 
            }else 
                findSuccess -=1;

            var json = {
                data: {
                    "sector" : sector,
                    "sitio" : sitio,
                    "tecnologia" : tecnologia                
                },
                action: 1
            };
            
            if(findSuccess == 3){
                console.log(json);
                $.ajax({
                    url: 'model/crudSector.php',
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
                                    that.getView().byId("sector").setValue("")
                                    that.getView().byId("slcSitio").setSelectedKey(0);
                                    that.getView().byId("slcTecnologia").setSelectedKey(0);
                                    oRouter.navTo("menuSector");
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
                    MessageBox.error("Completar los campos correctamente");                
                sap.ui.core.BusyIndicator.hide();
            }
        }
    });
});