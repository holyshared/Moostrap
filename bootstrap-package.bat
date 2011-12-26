cd C:\var\www\tools\packager

php packager build Moostrap/Moostrap.Executer.Sync +use-only Moostrap > C:\var\www\git\Bootstrap\Build\moostrap-sync.js
php packager build Moostrap/Moostrap.Executer.Async +use-only Moostrap > C:\var\www\git\Bootstrap\Build\moostrap-async.js

cd C:\var\www\tools\yuicompressor\build

java -jar yuicompressor-2.4.6.jar -o C:\var\www\git\Moostrap\Build\moostrap-sync-compressed.js C:\var\www\git\Moostrap\Build\moostrap-sync.js
java -jar yuicompressor-2.4.6.jar -o C:\var\www\git\Moostrap\Build\moostrap-async-compressed.js C:\var\www\git\Moostrap\Build\moostrap-async.js
