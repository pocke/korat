import { spawn } from 'child_process';
import { start } from './mainProcess/main';

const go = spawn('korat-go');

go.stdout.on('data', d => console.log(d.toString()));
go.stderr.on('data', d => console.log(d.toString()));

start();
