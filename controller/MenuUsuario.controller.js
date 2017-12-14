sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/m/MessageToast",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.MenuUsuario", {
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
                    oRouter.navTo("nuevoUsuario");                
                    break;
                case 2:
                    oRouter.navTo("listarUsuario");                
                    break;
                default:
                    oRouter.navTo("home");                
                    break;
            }
        },        
        onPressBack: function(oEvent) {
            this.goTo(oEvent, 100);
        },
        onPressNuevoUsuario: function(oEvent) {
            this.goTo(oEvent, 1);
        },
        onPressListarUsuario: function(oEvent) {
            this.goTo(oEvent, 2);
        }
    });
});