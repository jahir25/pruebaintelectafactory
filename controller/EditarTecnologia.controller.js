sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";
    var id_tecnologia = 0;
    return BaseController.extend("sap.ui.entelantenas.controller.EditarTecnologia", {
        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("editarTecnologia").attachMatched(function(oEvent){
                id_tecnologia = oEvent.getParameter("arguments").id_tecnologia;
                thes.getTecnologiaByID(id_tecnologia);
            }, this);
        },
        onPressBack: function(){
            /*var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("editarTecnologia");*/      
            window.history.back();
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
        getTecnologiaByID: function(data){
            var thes = this;
            var Parameters = {
                'data' : data,
            };
            $.ajax({
                url: 'model/getTecnologiaByID.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                data: Parameters,
                success: function(result, status, xhr){
                    var result = JSON.parse(result);
                    thes.getView().byId("tecnologia").setValue(result.nombre_tecnologia);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
        onPressAcepts:function(){
            if (this.getView().byId("tecnologia").getValue() == '' || this.getView().byId("tecnologia").getValue() == null) {
                sap.m.MessageBox.warning("Verifique que los datos sean correctos");
            }else{
                var thes = this;
                var oRouter = this.getOwnerComponent().getRouter();

                var Parameters = {
                    'nombre_tecnologia' : this.getView().byId("tecnologia").getValue(),
                    'id_tecnologia' : id_tecnologia
                };

                $.ajax({
                    url: 'model/ActualizarTecnologia.php',
                    cache: false,
                    timeout: 5000,
                    type: "POST",
                    data: Parameters,
                    success: function(result, status, xhr){
                        thes.getView().byId("tecnologia").setValue("");
                        /*oRouter.navTo("editarTecnologia");*/
                        window.history.back();
                        sap.m.MessageBox.success(JSON.parse(result).success);                        
                    },
                    error: function(xhr, status, error){
                        sap.m.MessageBox.error("Error de Conexion");
                    },
                    complete: function(){
                        
                    } 
                });

            }                
        }
    });
});