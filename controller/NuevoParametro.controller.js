sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";
    var that;
    return BaseController.extend("sap.ui.entelantenas.controller.NuevoParametro", {
        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("nuevoParametro").attachMatched(function(oEvent){
                that = this;
                thes.getcheckSession();
                thes.getTecnologiaData();
                thes.getTipoDato();
                that.fieldsClear();
                that.onValidGloblal();
            }, this);
        },
        onPressBack: function(){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuParametro");
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
        onValidGloblal: function(){
            if (this.getView().byId("checkglobal").getState() == true){
                this.getView().byId("selecttipotec").setSelectedKey(4),
                this.getView().byId("selecttipodato").setSelectedKey(2),
                this.getView().byId("valor").setVisible(true);
                this.getView().byId("selecttipotec").setEnabled(false);
                this.getView().byId("selecttipodato").setEnabled(false);
                this.getView().byId("nexcel").setEnabled(false);
                this.getView().byId("nu2000").setEnabled(false);
            }else if (this.getView().byId("checkglobal").getState() == false){
                this.getView().byId("selecttipotec").setSelectedKey(1),
                this.getView().byId("selecttipodato").setSelectedKey(1),
                this.getView().byId("valor").setVisible(false);
                this.getView().byId("selecttipotec").setEnabled(true);
                this.getView().byId("selecttipodato").setEnabled(true);
                this.getView().byId("nexcel").setEnabled(true);
                this.getView().byId("nu2000").setEnabled(true);
            }
        },
        getTecnologiaData : function(){
            var thes = this;
            var oView = this.getView();
            $.ajax({
                url: 'model/getTecnologiaDataNuevoParametro.php',
                cache: false,
                timeout: 5000,
                type: "GET",
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
        ValidarLetras :function(){
            var salidavalor = this.getView().byId("valor").getValue();
  
            var longCaden = salidavalor.length;
            var ultCarac = salidavalor.length - 1;
            var obtPuntoSpace = salidavalor.substring(ultCarac, longCaden);

            if (isNaN(salidavalor) == true || obtPuntoSpace == '.' || obtPuntoSpace == ' ' || longCaden > 11) {
                var setInput = salidavalor.substring(0, ultCarac);
                this.getView().byId("valor").setValue(setInput);
            }
        },  
        onPressAcepts:function(){

            if (this.getView().byId("checkglobal").getState() == true) {
                if (this.getView().byId("parametro").getValue() == '' || this.getView().byId("valor").getValue() == '') {
                    sap.m.MessageBox.warning("Verifique que los datos sean correctos");
                }else{
                    var thes = this;
                    var oRouter = this.getOwnerComponent().getRouter();

                    var Parameters = {
                        'nombre_parametro' : this.getView().byId("parametro").getValue(),
                        'state' : this.getView().byId("checkglobal").getState(),
                        'valor' : this.getView().byId("valor").getValue()
                    };

                    $.ajax({
                        url: 'model/nuevoParametro.php',
                        cache: false,
                        timeout: 5000,
                        type: "POST",
                        data: Parameters,
                        success: function(result, status, xhr){
                            if (JSON.parse(result).warning == 'true') {
                                sap.m.MessageBox.warning(JSON.parse(result).msg);
                            }else{
                                that.fieldsClear();
                                oRouter.navTo("menuParametro");
                                sap.m.MessageBox.success(JSON.parse(result).success);
                            }
                        },
                        error: function(xhr, status, error){
                            MessageBox.error("Error de Conexion");
                        },
                        complete: function(){
                            
                        } 
                    });
                }
            }else if(this.getView().byId("checkglobal").getState() == false) {
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
                        'state' : this.getView().byId("checkglobal").getState()
                    };

                    $.ajax({
                        url: 'model/nuevoParametro.php',
                        cache: false,
                        timeout: 5000,
                        type: "POST",
                        data: Parameters,
                        success: function(result, status, xhr){
                            if (JSON.parse(result).warning == 'true') {
                                sap.m.MessageBox.warning(JSON.parse(result).msg);
                            }else{
                                that.fieldsClear();
                                oRouter.navTo("menuParametro");
                                sap.m.MessageBox.success(JSON.parse(result).success);
                            }
                        },
                        error: function(xhr, status, error){
                            MessageBox.error("Error de Conexion");
                        },
                        complete: function(){
                            
                        } 
                    });
                }
            }
        },
        fieldsClear: function(){
            that.getView().byId("parametro").setValue("");
            that.getView().byId("selecttipotec").setSelectedKey(0);
            that.getView().byId("selecttipodato").setSelectedKey(0);
            that.getView().byId("nexcel").setValue("");
            that.getView().byId("nu2000").setValue("");
            that.getView().byId("checkglobal").setState(false);
            that.getView().byId("valor").setVisible(false);
        }
    });
});