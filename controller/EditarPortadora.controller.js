sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;    
    var portadora;
    return BaseController.extend("sap.ui.entelantenas.controller.EditarPortadora", {
        onInit : function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("editarPortadora").attachMatched(function(oEvent) {
                var id_portadora = oEvent.getParameter("arguments").id_portadora;                
                id_portadora = window.atob(id_portadora);
                portadora = id_portadora;
                that.getcheckSession();
                sap.ui.core.BusyIndicator.show(0);                
                that.getSectores();
                that.getPortadora(id_portadora);
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
        getPortadora: function(portadora){            
            var json = {"data": portadora, "action": 3};
            
            sap.ui.core.BusyIndicator.show(0);
            $.ajax({
                url: 'model/crudPortadora.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                    result = JSON.parse(result);

                    that.getView().byId("txtPortadora").setValue(result.portadora);
                    that.getView().byId("slcSector").setSelectedKey(result.codigo_sector);            
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },
        getSectores: function(){
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
        onPressBack: function(oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("listarPortadora");
        },
        onPressSave:function(){
            var oRouter = that.getOwnerComponent().getRouter();            
            var nombre = this.getView().byId("txtPortadora").getValue();            
            var sector = this.getView().byId("slcSector").getSelectedKey();
            var findSuccess = 0;            
            
            if(sector) findSuccess += 1; else findSuccess -=1;
            if(nombre) findSuccess += 1; else findSuccess -=1;

            var json = {
                data: {
                    "id": portadora,
                    "portadora" : nombre,
                    "sector" : sector                
                },
                action: 4
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

                        if(result.type == "s"){
                            sap.m.MessageBox.success(result.success,{
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function(oAction) {
                                    that.getView().byId("txtPortadora").setValue("");
                                    that.getView().byId("slcSector").getSelectedKey("");
                                    oRouter.navTo("listarPortadora");
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
        }
    });
});