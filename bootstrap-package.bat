cd C:\var\www\tools\packager

php packager build Bootstrap/Bootstrap.Executer.Sync +use-only Bootstrap > C:\var\www\git\Bootstrap\Build\bootstrap-sync.js
php packager build Bootstrap/Bootstrap.Executer.Async +use-only Bootstrap > C:\var\www\git\Bootstrap\Build\bootstrap-async.js

cd C:\var\www\tools\yuicompressor\build

java -jar yuicompressor-2.4.6.jar -o C:\var\www\git\Bootstrap\Build\bootstrap-sync-compressed.js C:\var\www\git\Bootstrap\Build\bootstrap-sync.js
java -jar yuicompressor-2.4.6.jar -o C:\var\www\git\Bootstrap\Build\bootstrap-async-compressed.js C:\var\www\git\Bootstrap\Build\bootstrap-async.js
