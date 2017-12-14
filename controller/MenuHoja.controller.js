sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/m/MessageToast",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";


    return BaseController.extend("sap.ui.entelantenas.controller.MenuHoja", {
        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("menuHoja").attachMatched(function(oEvent){
                thes.getcheckSession();
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
                    sap.m.MessageBox.error("Error de Conexion");
                },
                complete: function(){  
                } 
            });
        },
        goTo: function(oEvent, index){
            var oRouter = this.getOwnerComponent().getRouter();
            switch(index){
                case 1:
                    oRouter.navTo("nuevaHoja");
                    break;
                case 2:
                    oRouter.navTo("listarHoja");                   
                    break;
                case 3:
                    oRouter.navTo("asignarParametro");                   
                    break;
                default:
                    oRouter.navTo("home");                
                    break;
            }
        },             
        onPressBack: function(oEvent) {
            this.goTo(oEvent, 100);
        },
        onPressNuevaHoja: function(oEvent) {
            this.goTo(oEvent, 1);
        },
        onPressListarHoja: function(oEvent) {
            this.goTo(oEvent, 2);
        },
        onPressAsignarParametro: function(oEvent) {
            this.goTo(oEvent, 3);
        }        
    });
});