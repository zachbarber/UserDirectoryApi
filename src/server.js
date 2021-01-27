import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

global.__dirname = path.resolve('./');
console.log(__dirname);