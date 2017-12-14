sap.ui.define([
    "sap/ui/entelantenas/controller/BaseController",    
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, MessageToast, MessageBox) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.HomeUser", {
        onInit : function (oEvent) {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("homeUser").attachMatched(function(oEvent){
                thes.getcheckSession();
            }, this);
        },
        getcheckSession: function(){
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
        goTo: function(index) {
            var oRouter = this.getOwnerComponent().getRouter();
            switch(index){
                case 1:   
                    oRouter.navTo("exportarImportar");
                    break;
                case 2:
                    oRouter.navTo("menuParametro");
                    break;                     
                case 3:   
                    oRouter.navTo("menuSitio");                
                    break;     
                default:
                    break;
            }
        },
        onPressExcel: function(){
            this.goTo(1);
        },
        onPressParametroRf: function(){
            this.goTo(2);
        },
        onPressVecindades: function(){
            this.goTo(3);
        }
    });
});