sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var id_parametro;
    var id_tecnologia_rou;
    return BaseController.extend("sap.ui.entelantenas.controller.EditarParametro", {

        onInit : function () {
        	var oView = this.getView();
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("editarParametro").attachMatched(function(oEvent){
                id_parametro = oEvent.getParameter("arguments").id_parametro;
                id_tecnologia_rou = oEvent.getParameter("arguments").id_tecnologia;
                thes.getTecnologiaData(id_tecnologia_rou);
                thes.getTipoDato();
                thes.getParametrosByID(id_parametro);
                thes.getcheckSession();
            }, this);
        },
        onPressBack: function(oEvent) {          
            /*var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuParametro");*/
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
        getTecnologiaData : function(data){
            var thes = this;
            var oView = this.getView();
            var Parameters = {
                'data' : data,
            };
            $.ajax({
                url: 'model/getTecnologiaData.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                data: Parameters,
                success: function(result, status, xhr){
                    var tipotec = JSON.parse(result);
                    var oModel = new JSONModel({
                       "tipotecitems": tipotec
                    });
                    oView.byId('selecttipotec').setModel(oModel, "tipotec");
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                }
            });
        },
        getTipoDato : function(){
            var thes = this;
            var oView = this.getView();
            $.ajax({
                url: 'model/getTipoDato.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    var tipodato = JSON.parse(result);
                    var oModel = new JSONModel({
                       "tipodatoitems": tipodato
                    });
                    oView.byId('selecttipodato').setModel(oModel, "tipodato");
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                }
            });
        },
        getParametrosByID: function(data){
            var thes = this;
            var Parameters = {
                'data' : data,
            };
            $.ajax({
                url: 'model/getParametrosByID.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                data: Parameters,
                success: function(result, status, xhr){
                var result = JSON.parse(result);   
                console.log(result);
                thes.getView().byId("parametro").setValue(result.nombre_parametro);
                thes.getView().byId("selecttipotec").setSelectedKey(result.id_tecnologia);
                thes.getView().byId("selecttipodato").setSelectedKey(result.id_tipodato);
                thes.getView().byId("nexcel").setValue(result.nombre_excel);
                thes.getView().byId("nu2000").setValue(result.nombre_u2000);
/*                sap.ui.getCore().byId("parametro").getValue(result.NOMBREPARAM);*/
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
        onPressAcepts: function(){

            if (this.getView().byId("parametro").getValue() == ''|| this.getView().byId("nexcel").getValue() == '' || this.getView().byId("nu2000").getValue() == '' || this.getView().byId("parametro").getValue() == null) {
                sap.m.MessageBox.warning("Verifique que los datos sean correctos");
            }else{
                var thes = this;
                var oRouter = this.getOwnerComponent().getRouter();

                var Parameters = {
                    'nombre_parametro' : this.getView().byId("parametro").getValue(),
                    'id_tecnologia' : this.getView().byId("selecttipotec").getSelectedKey(),
                    'id_tipodato' : this.getView().byId("selecttipodato").getSelectedKey(), 
                    'nexcel' : this.getView().byId("nexcel").getValue(),
                    'nu2000' : this.getView().byId("nu2000").getValue(),                   
                    'id_parametro' : id_parametro,
                };

                $.ajax({
                    url: 'model/ActualizarParametro.php',
                    cache: false,
                    timeout: 5000,
                    type: "POST",
                    data: Parameters,
                    success: function(result, status, xhr){
                        /*oRouter.navTo("menuParametro");*/
                        window.history.back();
                        sap.m.MessageBox.success('Actualizado Exitosamente');
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