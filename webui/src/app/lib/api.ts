/* 
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License. 
 */

import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import axios, { AxiosError } from 'axios';

const configFile = './config/config.yaml';
const apiPrefix = '/api/v1';
let host;
try {
    const wholeFilePath = path.join(process.cwd(), '..', configFile);
    const doc = yaml.load(fs.readFileSync(wholeFilePath, 'utf8'));
    host = (doc as any)['addr'];
} catch (error) {
    host = '127.0.0.1:9379';
}
const apiHost = `http://${host}${apiPrefix}`;

export async function fetchNamespaces(): Promise<string[]> {
    try {
        const { data: responseData } = await axios.get(`${apiHost}/namespaces`);
        return responseData.data.namespaces || [];
    } catch (error) {
        handleError(error);
        return [];
    }
}
export async function createNamespace(name: string): Promise<string> {
    try {
        const { data: responseData } = await axios.post(`${apiHost}/namespaces`, {namespace: name});
        if(responseData?.data == 'created') {
            return '';
        } else {
            return handleError(responseData);
        }
    } catch (error) {
        return handleError(error);
    }
}

export async function deleteNamespace(name: string): Promise<string> {
    try {
        const { data: responseData } = await axios.delete(`${apiHost}/namespaces/${name}`);
        if(responseData?.data == 'ok') {
            return '';
        } else {
            return handleError(responseData);
        }
    } catch (error) {
        return handleError(error);
    }
}

function handleError(error: any): string {
    let message: string = '';
    if(error instanceof AxiosError) {
        message = error.response?.data?.error?.message || error.message;
    } else if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'object') {
        message = error?.error?.message || error?.message;
    }
    return message || 'Unknown error';
}