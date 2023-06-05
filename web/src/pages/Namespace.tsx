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
 *
 */
import { Button, Popconfirm, Space, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ClusterCreationModal } from '../components/sidebar/ClusterCreationModal';
import { useCallback, useState } from 'react';
import { useApi } from '../hooks/useApi';

export function Namespace() {
    const {namespace} = useParams();
    const [clusterCreationModal, setClusterCreationModal] = useState(false);
    const navigate = useNavigate();
    const {send: sendDelete} = useApi<'deleteNamespace'>('deleteNamespace');
    const onDelete = useCallback(async () => {
        if(!namespace) {
            return;
        }
        const success = await sendDelete(namespace);
        if(success) {
            navigate('/');
        }
    },[namespace]);
    const onClusterCreated = useCallback((namespace: string, cluster: string) => {
        navigate(`/${namespace}/${cluster}`);
    },[]);
    return (<>
        {
            namespace && <div className='centered-horizontally-and-vertically-parent' style={{height: '100%'}}>
                <Typography.Title level={4} style={{margin: 0}}>
                    { `namespace: ${namespace}` }
                </Typography.Title>
                <Space className='centered-horizontally-and-vertically'>
                    <Button size='large' onClick={() => setClusterCreationModal(true)}>Create Cluster</Button>
                    <Popconfirm 
                        title='Delete Namespace'
                        description={<div style={{maxWidth: '50vw', wordBreak: 'break-all'}}>{
                            `Are you sure you want to delete namespace ${namespace}`
                        }</div>}
                        onConfirm={onDelete}
                        okButtonProps={{danger: true}}
                    >
                        <Button size='large' danger>Delete Namespace</Button>
                    </Popconfirm>
                </Space>
                <ClusterCreationModal
                    namespaces={[namespace]}
                    defaultNamespace={namespace}
                    disableNamespaceSelection
                    open={clusterCreationModal} 
                    onclose={() => setClusterCreationModal(false)}
                    oncreated={onClusterCreated}
                />
            </div>
        }
    </>);
}