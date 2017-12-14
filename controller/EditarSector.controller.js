sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;    
    var cod_sector;
    return BaseController.extend("sap.ui.entelantenas.controller.EditarSector", {
        onInit : function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("editarSector").attachMatched(function(oEvent) {
                var sector = oEvent.getParameter("arguments").codigo;                
                sector = window.atob(sector);
                cod_sector = sector;
                that.getcheckSession();
                sap.ui.core.BusyIndicator.show(0);                
                that.getTecnologiaAndSitio();
                that.getSector(sector);
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
        getSector: function(sector){            
            var json = {"data": cod_sector, "action": 3};
            sap.ui.core.BusyIndicator.show(0);
            $.ajax({
                url: 'model/crudSector.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                    result = JSON.parse(result);

                    that.getView().byId("sector").setValue(result.codigo_sector);
                    that.getView().byId("slcSitio").setSelectedKey(result.codigo_sitio);
                    that.getView().byId("slcTecnologia").setSelectedKey(result.id_tecnologia);            
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    sap.ui.core.BusyIndicator.hide();
                }
            });
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
                    /*sap.ui.core.BusyIndicator.hide();*/
                }
            });
                        
        },
        onPressBack: function(oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("listarSector");
        },
        onPressSave:function(){
            var oRouter = that.getOwnerComponent().getRouter();            
            var sitio = this.getView().byId("slcSitio").getSelectedKey();
            var tecnologia = this.getView().byId("slcTecnologia").getSelectedKey();            
            var findSuccess = 0;            
            
            if(sitio) findSuccess += 1; else findSuccess -=1;
            if(tecnologia) findSuccess += 1; else findSuccess -=1;

            var json = {
                data: {
                    "sector": cod_sector,
                    "sitio" : sitio,
                    "tecnologia" : tecnologia                
                },
                action: 4
            };
            
            if(findSuccess == 2){
                sap.ui.core.BusyIndicator.show(0);
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
                                    that.getView().byId("sector").setValue("");
                                    that.getView().byId("slcSitio").getSelectedKey("");
                                    that.getView().byId("slcTecnologia").getSelectedKey("");
                                    oRouter.navTo("listarSector");
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