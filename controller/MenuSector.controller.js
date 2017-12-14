sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/m/MessageToast",
], function (BaseController, JSONModel, MessageToast) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.MenuSector", {
        onInit : function () {
            this.getcheckSession();
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
        goTo: function(oEvent, index){
            var oRouter = this.getOwnerComponent().getRouter();
            switch(index){
                case 1:
                    oRouter.navTo("nuevoSector");                
                    break;
                case 2:
                    oRouter.navTo("listarSector");                
                    break;
                default:
                    oRouter.navTo("home");                
                    break;
            }
        },        
        onPressBack: function(oEvent) {
            this.goTo(oEvent, 100);
        },
        onPressNuevoSector: function(oEvent) {
            this.goTo(oEvent, 1);
        },
        onPressListarSector: function(oEvent) {
            this.goTo(oEvent, 2);
        }
    });
});