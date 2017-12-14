sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;
    return BaseController.extend("sap.ui.entelantenas.controller.NuevaPortadora", {
        onInit : function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("nuevaPortadora").attachMatched(function(oEvent) {
                that.getcheckSession();
                that.getSector();
                that.fieldsClear();
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
        onPressBack: function(oEvent) {      
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuPortadora");
        },
        getSector: function(){
            var json = {
                data: {},
                action: 6
            };
            
            sap.ui.core.BusyIndicator.show(0);
            $.ajax({
                url: 'model/crudPortadora.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                    result = JSON.parse(result);                     
                    var sector = new JSONModel(result);                    
                    
                    that.getView().byId("slcSector").setModel(sector);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    sap.ui.core.BusyIndicator.hide();
                }
            });
                        
        },
        onPressSave:function(){
            var oRouter = this.getOwnerComponent().getRouter();            
            var sector = this.getView().byId("slcSector").getSelectedKey();            
            var portadora = this.getView().byId("txtPortadora").getValue();
            var findSuccess = 0;
            
            if(sector) findSuccess += 1; else findSuccess -=1;
            if(portadora) findSuccess += 1; else findSuccess -=1;

            var json = {
                data: {
                    "sector" : sector,
                    "portadora" : portadora                
                },
                action: 1
            };

            if(findSuccess == 2){
                sap.ui.core.BusyIndicator.show(0);
                $.ajax({
                    url: 'model/crudPortadora.php',
                    cache: false,
                    timeout: 5000,
                    type: "POST",
                    data: JSON.stringify(json),
                    success: function(result, status, xhr){
                        result = JSON.parse(result);                        
                        that.fieldsClear();
                        if(result.type == "s"){
                            sap.m.MessageBox.success(result.success,{
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function(oAction) {                                    
                                    oRouter.navTo("menuPortadora");
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
            }else if(findSuccess == 0){
                MessageBox.error("Completar los campos correctamente");
            }
        },
        fieldsClear: function(){
            that.getView().byId("slcSector").setSelectedKey(0);
            that.getView().byId("txtPortadora").setValue("");
        }
    });
});