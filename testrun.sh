echo "Create new user"
curl -H "Content-Type: application/json" -X POST -d "{'userId' : '123', 'name' : 'Marcus Hammarberg', 'age' : 43 }" https://088zr0agp9.execute-api.us-west-2.amazonaws.com/latest/users

echo
echo "Get the created user"
curl -H "Content-Type: application/json" https://088zr0agp9.execute-api.us-west-2.amazonaws.com/latest/users/123

echo
echo "Update user"
curl -H "Content-Type: application/json" -X PUT -d "{'userId' : '123', 'name' : 'Carl Marcus Hammarberg', 'age' : 44 }" https://088zr0agp9.execute-api.us-west-2.amazonaws.com/latest/users/123 

echo
echo "Get updated user"
curl -H "Content-Type: application/json" https://088zr0agp9.execute-api.us-west-2.amazonaws.com/latest/users/123

echo
echo "Delete user"
curl -X DELETE https://088zr0agp9.execute-api.us-west-2.amazonaws.com/latest/users/123

echo
echo "Test run done... I should proabaly have done this in Javascript, huh?"
echo "Ok... I did. run it with 'npm test', and find the tests in the tests folder"