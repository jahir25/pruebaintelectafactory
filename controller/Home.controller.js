sap.ui.define([
    "sap/ui/entelantenas/controller/BaseController",    
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, MessageToast, MessageBox) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.Home", {
        onInit : function (oEvent) {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("home").attachMatched(function(oEvent){
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
                    oRouter.navTo("menuUsuario");
                    break;
                case 2:
                    oRouter.navTo("menuParametro");
                    break;                     
                case 3:   
                    oRouter.navTo("menuSitio");                
                    break;     
                case 4:   
                    oRouter.navTo("menuSector");                
                    break;
                case 5:
                    oRouter.navTo("menuTecnologia");
                    break;
                case 6:
                    oRouter.navTo("menuHoja");
                    break;
                case 7:
                    oRouter.navTo("menuPortadora");
                    break;
                case 8:
                    oRouter.navTo("menuValores");
                    break;
                default:
                    break;
            }
        },
        onUsuario: function(){
            this.goTo(1);
        },
        onParametro: function(){
            this.goTo(2);
        },
        onPressSitio: function(){
            this.goTo(3);
        },
        onPressSector: function(){
            this.goTo(4)
        },
        onTecnologia: function(){
            this.goTo(5);
        },
         OnHojas: function(){
            this.goTo(6);
        },
        onPressValores:function(){
            this.goTo(8)
        },
        onPressPortadora: function(){
            this.goTo(7);
        },
        onPressValores: function(){
            this.goTo(8);
        }
    });
});