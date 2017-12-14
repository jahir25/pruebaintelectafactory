sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";

    return BaseController.extend("sap.ui.entelantenas.controller.ListarParametro", {

        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            this.getView().byId('tecnologia').getColumns()[0].setVisible(false);
            oRouter.getRoute("listarParametro").attachMatched(function(oEvent){
                thes.getTecnologia();
                thes.getcheckSession();
            }, this);
        },
        onPressBack: function(oEvent) {          
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuParametro");
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
                    sap.m.MessageBox.error("Error de Conexion");
                },
                complete: function(){  
                } 
            });
        },
        getTecnologia: function(){
            var thes = this;
            $.ajax({
                url: 'model/getTecnologia.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    var oModel = new JSONModel(JSON.parse(result));
                    thes.getView().byId('tecnologia').setModel(oModel);
                },
                error: function(xhr, status, error){
                    sap.m.MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });

        },
        getParametros: function(sPath){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("parametroTecnologia", {'sPath': sPath});
        },
        onSelectionChange: function(oEvent){
            var sPath = btoa(oEvent.getParameter("listItem").mAggregations.cells[0].mProperties.text);
            this.getParametros(sPath);
        }
        
    });
});