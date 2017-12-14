sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;
    var oDataParametro;
    return BaseController.extend("sap.ui.entelantenas.controller.NuevoValores", {
        onInit : function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("nuevoValores").attachMatched(function(oEvent) {
                that.getcheckSession();
                that.getFilters();
                that.getView().byId("slcSector").clearSelection();
                that.getView().byId("slcParametro").setSelectedKey("");
                that.getView().byId("slcTipodato").setSelectedKey("");
                that.getView().byId("slcTecnologia").setSelectedKey("");
                that.getView().byId("txtValue").setValue("");
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
        onPressBack: function(oEvent) {      
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuValores");
        },
        getFilters: function(){
            var sector = [];
            var parametro = [];
            var tipodato = [];
            var tecnologia = [];
            var json = {
                data: {},
                action: 7
            };

            sap.ui.core.BusyIndicator.show(0);
            $.ajax({
                url: 'model/crudValores.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                    result = JSON.parse(result);                     
                    sector = new JSONModel(result[0]);
                    oDataParametro = result[1];
                    tipodato = new JSONModel(result[2]);
                    tecnologia = new JSONModel(result[3]);                    
                    that.getView().byId("slcSector").setModel(sector);
                    that.getView().byId("slcTipodato").setModel(tipodato);
                    that.getView().byId("slcTecnologia").setModel(tecnologia);
                    $.each(oDataParametro, function(key, item){                        
                        if(item.id_tipodato == tipodato.getData()[0].id_tipodato && item.id_tecnologia == tecnologia.getData()[0].id_tecnologia){
                            parametro.push(item);
                        }
                    });
                    parametro = new JSONModel(parametro);
                    that.getView().byId("slcParametro").setModel(parametro);                    
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    sap.ui.core.BusyIndicator.hide();
                }
            });            
        },
        onPressSave:function(){
            var oRouter = this.getOwnerComponent().getRouter();            
            var sector = this.getView().byId("slcSector").getSelectedKey();            
            var parametro = this.getView().byId("slcParametro").getSelectedKey(); 
            var tipodato = that.getView().byId("slcTipodato").getSelectedKey();
            var value = this.getView().byId("txtValue").getValue();
            var type = 0;
            var findSuccess = 0;
            var decimal = /^[-|+]?[0-9]{0,10}(.[0-9]{0,8})?$/;
            
            if(sector) findSuccess += 1; else findSuccess -=1;
            if(parametro) findSuccess += 1; else findSuccess -=1;
            
            if(value.match(decimal) && tipodato == 2 || tipodato == 3){
                findSuccess += 1; 
            }else{
               if(tipodato != 1){
                    MessageBox.error("Ingresar el valor Correcto para el campo Valor");
                    findSuccess -=1;                   
                }
            }
            
            if(value.match(decimal) && tipodato == 2 || tipodato == 3){
                type = 1;                
            }else{
                type = 2;
            }
            var json = {
                data: {
                    "sector" : sector,
                    "parametro" : parametro,
                    "value": value,
                    "type": type
                },
                action: 1
            };

            if(findSuccess >= 2){
                sap.ui.core.BusyIndicator.show(0);
                $.ajax({
                    url: 'model/crudValores.php',
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
                                    that.getView().byId("slcSector").clearSelection();
                                    that.getView().byId("slcParametro").setSelectedKey("");
                                    that.getView().byId("slcTipodato").setSelectedKey("");
                                    that.getView().byId("slcTecnologia").setSelectedKey("");
                                    that.getView().byId("txtValue").setValue("");
                                    oRouter.navTo("menuValores");
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
        },
        changeTecnologia: function(oEvent){
            var parametro = [];
            var tecnologia = that.getView().byId("slcTecnologia").getSelectedKey();
            var tipodato = that.getView().byId("slcTipodato").getSelectedKey();
            $.each(oDataParametro, function(key, item){
                if(item.id_tipodato == tipodato && item.id_tecnologia == tecnologia){                    
                    parametro.push(item);
                }
            });
            parametro = new JSONModel(parametro);
            that.getView().byId("slcParametro").setModel(parametro);
        },
        changeTipoDato: function(oEvent){
            var parametro = [];
            var tecnologia = that.getView().byId("slcTecnologia").getSelectedKey();
            var tipodato = that.getView().byId("slcTipodato").getSelectedKey();
            var tipodatoValue = that.getView().byId("slcTipodato").getSelectedItem();
            
            if(tipodatoValue == "TEXTO"){
               that.getView().byId("txtValue").setType("Text");
            }else{
               that.getView().byId("txtValue").setType("Number");                
            }
            $.each(oDataParametro, function(key, item){
                if(item.id_tipodato == tipodato && item.id_tecnologia == tecnologia){                    
                    parametro.push(item);
                }
            });            
            parametro = new JSONModel(parametro);
            that.getView().byId("slcParametro").setModel(parametro);
        }
    });
});