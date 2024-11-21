# Para integrar a criação de usuários no Keycloak ao fluxo de criação de usuários no banco de dados, 
# você pode fazer as seguintes modificações no método create_user dentro do manager. 
# A ideia é chamar o serviço de integração logo após o sucesso da criação no banco de dados. 
# Veja como ajustar:

# Alteração no manager
# Adicione a chamada ao serviço de integração (integration_service.user_create) logo após a criação do usuário no banco de dados.

# python
# Copiar código
# def create_user(self, request: dict):
#     try:
#         # Criação no banco de dados
#         response_data = self.user_service.create_user(request)

#         if response_data.get("data") is not None:
#             # Dados do usuário criado
#             user_data = response_data.get("data")

#             # Chamada ao serviço de integração para criar o usuário no Keycloak
#             integration_success = self.integration_service.user_create(user_data)

#             if integration_success:
#                 return {
#                     "data": user_data,
#                     "status_code": 200,
#                     "Integration_status": "Integration with Keycloak user creation was successful."
#                 }
#             else:
#                 return {
#                     "data": user_data,
#                     "status_code": 400,
#                     "Integration_status": "Integration with Keycloak user creation has failed."
#                 }
#         else:
#             return {
#                 "data": response_data.get("error"),
#                 "status_code": 400,
#                 "Integration_status": "User creation failed at the database level."
#             }

#     except ValidationException as ve:
#         self.logger.error(f"Validation error: {ve}")
#         return {"data": str(ve), "status_code": 400}

#     except Exception as e:
#         self.logger.error(f"Unexpected error: {e}")
#         return {"data": "Internal Server Error", "status_code": 500}
    
# Alteração no Integration Service
# O integration_service.user_create espera receber um objeto de usuário
# e realiza a integração com o Keycloak. Certifique-se de que o método esteja 
# preparado para lidar com os dados do usuário.

# Atualize o método para usar os dados do banco (como first_name, last_name e email) no processo de criação no Keycloak.

# python
# Copiar código
# def user_create(self, user: dict) -> bool:
#     try:
#         self.logger.info(f"Integrating user to Keycloak: {user}")

#         # Dados do usuário
#         user_id = user.get("id")
#         user_email = user.get("email")
#         user_firstname = user.get("first_name", "")
#         user_lastname = user.get("last_name", "")

#         # Chamada ao Keycloak Service
#         keycloak_user_id = self.keycloak_service.user_create(user_id, user_email, user_firstname, user_lastname)
#         success = keycloak_user_id is not None

#         if success and not user.get("keycloak_user_id"):
#             # Atualiza o ID do Keycloak no banco
#             self.user_repository.update_keycloak_user(user_id, keycloak_user_id)

#         return success
#     except Exception as ex:
#         self.logger.error(f"Error integrating user to Keycloak: {ex}")
#         return False
    
# Ajustes no Keycloak Service
# Certifique-se de que o método user_create no KeycloakService está funcionando corretamente, como mostrado no código existente.

# Resumo do Fluxo
# Manager: Recebe o request, cria o usuário no banco via user_service, e chama o integration_service.user_create para integrá-lo ao Keycloak.
# Integration Service: Recebe os dados do usuário criado, chama o keycloak_service.user_create e, se bem-sucedido, atualiza o ID do Keycloak no banco.
# Keycloak Service: Trata a criação/atualização no Keycloak.
# Essa abordagem garante que a criação de usuários no Keycloak está completamente integrada ao fluxo existente, e que falhas na integração não impactam a criação no banco.


# agora, preciso pegar esse id
# ser_id encontrado: 9f1c=0e-fbf9-4198=3-3b8e=7e47 para o email felipea@gmail.com

# e salvar no banco, na coluna 'keycloak_user_id'


# ara salvar o keycloak_user_id retornado no banco de dados, 
# você pode ajustar o Integration Service para atualizar o campo keycloak_user_id 
# na tabela de usuários logo após a criação do usuário no Keycloak. Aqui está como fazer:

# Atualização no Integration Service
# Dentro do método user_create, adicione a chamada ao repositório para 
# atualizar o keycloak_user_id no banco, após o ID ser retornado pelo Keycloak.

# python
# Copiar código
# def user_create(self, user: dict) -> bool:
#     try:
#         self.logger.info(f"Integrating user to Keycloak: {user}")

#         # Dados do usuário
#         user_id = user.get("id")
#         user_email = user.get("email")
#         user_firstname = user.get("first_name", "")
#         user_lastname = user.get("last_name", "")

#         # Chamada ao Keycloak Service
#         keycloak_user_id = self.keycloak_service.user_create(user_id, user_email, user_firstname, user_lastname)
#         success = keycloak_user_id is not None

#         if success:
#             self.logger.info(f"Keycloak user ID retrieved: {keycloak_user_id}")

#             # Atualiza o ID do Keycloak no banco de dados
#             self.user_repository.update_keycloak_user(user_id, keycloak_user_id)

#         return success
#     except Exception as ex:
#         self.logger.error(f"Error integrating user to Keycloak: {ex}")
#         return False
# Atualização no User Repository
# Implemente o método update_keycloak_user no repositório para atualizar o keycloak_user_id no banco.

# python
# Copiar código
# def update_keycloak_user(self, user_id: int, keycloak_user_id: str):
#     try:
#         # Atualiza o campo `keycloak_user_id` do usuário
#         user = self.alchemy_session.query(UserModelBase).filter_by(id=user_id).first()
#         if user:
#             user.keycloak_user_id = keycloak_user_id
#             self.alchemy_session.commit()
#             self.logger.info(f"Keycloak user ID {keycloak_user_id} updated successfully for user ID {user_id}.")
#         else:
#             self.logger.error(f"User with ID {user_id} not found.")
#     except Exception as e:
#         self.alchemy_session.rollback()
#         self.logger.error(f"Error updating Keycloak user ID for user ID {user_id}: {e}")
#         raise
#     finally:
#         self.alchemy_session.close()
# Fluxo Resumido
# Keycloak Service: Retorna o keycloak_user_id após criar/atualizar o usuário no Keycloak.
# Integration Service: Recebe o keycloak_user_id e chama o repositório para atualizar o banco de dados.
# User Repository: Atualiza o campo keycloak_user_id para o usuário correspondente.
# Resultado Esperado
# Quando o método user_create for chamado no Integration Service, o ID retornado do Keycloak será salvo no banco na coluna keycloak_user_id. Além disso, logs detalhados ajudarão a depurar o processo, incluindo a mensagem de sucesso ou erro para cada etapa.