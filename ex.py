# Preciso que, ao criar um usuário no banco, também seja criado no keycloak.... Tenho tudo pronto
# só preciso unir! Chamando atraves de manager user
# Poderia me ajudar? Preciso salvar no keycloak

# manager
#     def create_user(self, request: dict):
#         try:
#             response_data = self.user_service.create_user(request)
            
#             if response_data.get('data') is not None:
#                 response_data_integration
#                 if response_data_integration:
#                     return {"data": response_data.get('data'), "status_code": 200, "Integration_status": "Integration with keycloak user create was successful."}
#                 else:
#                     return {"data": response_data.get('error'), "status_code": 400, "Integration_status": "Integration with keycloak user create has failed."} 

#         except ValidationException as ve:
#             self.logger.error(f"Validation error: {ve}")
#             return {"data": str(ve), "status_code": 400} 

#         except Exception as e:
#             self.logger.error(f"Unexpected error: {e}")
#             return {"data": "Internal Server Error", "status_code": 500}


# user service.create user
#    def create_user(self, request: dict):

#         if 'email' in request['where']:
#             request['where']['email'] = request['where']['email'].lower()

#         list_required_fields = [
#             "email",
#             "first_name",
#             "last_name",
#             "departament_company",
#             "is_internal",
#             "creator_user_name",
#             "organization_id"
#         ]
        
#         data = request["where"]
#         if self.DEBUG:
#             self.logger.info("method: {} - data: {}".format(get_function_name(), data))
        
#         if not data:
#             raise ValidationException(MessagesEnum.REQUEST_ERROR)
        
#         try:
#             self.check_required_params(request, list_required_fields)
#         except Exception as e:
#             raise e   
               
#         try:
#             if data == dict():
#                 raise ValidationException(MessagesEnum.REQUEST_ERROR)
#             data["update_date"] = data["creation_date"]
#             data["update_user_id"] = data["creator_user_id"]
#             data["update_user_name"] = data["creator_user_name"]
            
#             user_vo = UserVO(data)
        

#             result = self.user_repository.create(user_vo)
            
#             if result:
#                 data = user_vo.to_api_response()
#             else:
#                 return {"data": None, "error": "Error creating user."}
#         except Exception as err:
#             self.logger.error(err)
#             self.exception = err

#         return {"data": data, "error": None}


# user repository
#     def create(self, user_data: UserVO):
#         # response = False
#         organization_id = user_data.organization_id
#         organization = self.alchemy_session.query(OrganizationModelBase).filter_by(id=organization_id).first()

#         if organization is None:
#             self.logger.error(f"Organization ID {organization_id} not found")

#         try:
#             new_user = UserModelBase(**user_data.to_dict())
#             self.alchemy_session.add(new_user)
#             self.alchemy_session.commit()
#             self.logger.info(f"User created successfully: {new_user.id}")
#             user = new_user.id
#             # self._close()
#             response = True
#             # return new_user
#         except Exception as err:
#             self.alchemy_session.rollback()
#             self.logger.error(err)
#             return err
#             # self._close()
#         finally:
#             self.alchemy_session.close()

# aqui onde eu devo chamar pra integrar, integration service
#     def user_create(self, user: UserModelBase):
        
#         # KeyCloak Integration
#         self.logger.info(f"keycloak user id {user.keycloak_user_id}")

#         try:
#             self.logger.info("aqui")
                        

#             keycloak_user_id = user.keycloak_user_id
#             self.logger.info(f"aqui {keycloak_user_id}")

#             user_email = user.email
#             user_firstname = "" #waiting the creation of firstname field inside user
#             user_lastname = "" #waiting the creation of lastname field inside user
            
#             keycloak_user_id = self.keycloak_service.user_create(keycloak_user_id, user_email, user_firstname, user_lastname)
#             success = keycloak_user_id is not None
            
#             if (user.keycloak_user_id is None):
#                 self.user_repository.update_keycloak_user(user.id, keycloak_user_id)
#         except Exception as ex:
#             success = False
        
#         return success

# keycloak service
#     def user_create(self, user_id: str, user_email: str, user_firstname: str, user_lastname: str) -> str:
#         try:
#             self.logger.info("testando")
#             parameters = self.__get_parameters()
#             token = self.__get_admin_token(parameters)
#             users = self.__list_users(parameters, token)

#             if users is not None and user_id in users:
#                 success = self.__update_user(parameters, token, user_id, user_email, user_firstname, user_lastname)
#                 users = self.__list_users(parameters, token)

#             elif users is not None and user_email in users.values():
#                 self.logger.info(f"ENTROU AQUI")
#                 self.logger.info(f"usuarios listado")
#                 user_id = [key for key, value in users.items() if value == user_email][0]
#                 success = self.__update_user(parameters, token, user_id, user_email, user_firstname, user_lastname)
#             else:
#                 success = self.__create_user(parameters, token, user_email, user_firstname, user_lastname)
#                 self.logger.info(f"usuario criado: {success}")
                
#                 users = self.__list_users(parameters, token)
#                 self.logger.info("Listando usuários:\n" + "\n".join(f"{key}: {value}" for key, value in users.items()))
                
#                 # Debug do user_email que estamos buscando
#                 self.logger.info(f"Procurando por user_email: {user_email}")

#                 user_ids = [key for key, value in users.items() if value == user_email]
#                 if user_ids:
#                     user_id = user_ids[0]
#                     self.logger.info(f"user_id encontrado: {user_id} para o email {user_email}")
#                 else:
#                     self.logger.error(f"Usuário criado, mas não encontrado na lista para o email {user_email}")
#                     raise Exception("Usuário não encontrado")
#             if success:
#                 return user_id
#         except Exception as err:
#             self.logger.error(err)
#             raise err