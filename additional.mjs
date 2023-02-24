import fetch from 'node-fetch';
import './db.mjs';
import mongoose from 'mongoose'
import e from 'express';

const date = new Date().toLocaleString('en-US', {
   timeZone: 'America/Los_Angeles',
   hour12: false,
 });
