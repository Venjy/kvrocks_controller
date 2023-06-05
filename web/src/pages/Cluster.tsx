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
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import { Cluster as ClusterEntity } from '../entitits/Cluster';
import { Button, Card, Popconfirm, Spin, Typography } from 'antd';

const cardItemStyle: CSSProperties = {
    marginTop: 0
};

export function Cluster() {
    const navigate = useNavigate();
    const {namespace, cluster} = useParams();
    const {send} = useApi<'getCluster'>('getCluster', {
        namespace: namespace || '',
        cluster: cluster || ''
    });
    const [entity, setEntity] = useState<ClusterEntity | null>(null);
    useEffect(() => {
        if(!namespace || !cluster) {
            return;
        }
        (async () => {
            setEntity(null);
            const response = await send({namespace, cluster});
            setEntity(response);
        })();
    },[namespace, cluster]);
    const {send: sendDelete} = useApi<'deleteCluster'>('deleteCluster');
    const onDelete = useCallback(async () => {
        const success = await sendDelete({
            namespace: entity?.namespace || namespace || '',
            cluster: entity?.name || cluster || ''
        });
        if(success) {
            navigate('/');
        }
    }, [entity, namespace, cluster]);
    return (<>
        {
            entity
                ?
                <>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{marginRight: '10px'}}>
                            <Typography.Title level={4} style={{margin: 0}}>
                                { `${entity.name}` }
                            </Typography.Title>
                            <Typography.Text>
                                { `in namespace ${entity.namespace}` }
                            </Typography.Text>
                        </div>
                        <div>
                            <Popconfirm
                                title='Delete Cluster'
                                description={<div style={{maxWidth: '50vw', wordBreak: 'break-all'}}>{
                                    `Are you sure you want to delete cluster ${entity.name}`
                                }</div>}
                                okButtonProps={{danger: true}}
                                onConfirm={onDelete}
                            >
                                <Button danger>Delete</Button>
                            </Popconfirm>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        marginTop: '10px'
                    }}>
                        {
                            entity.nodes.map(node => (
                                <Card
                                    title={node.addr}
                                    key={node.id}
                                    style={{
                                        margin:'0 10px 10px 0',
                                        minWidth: '200px',
                                        maxWidth: '450px',
                                        width: '300px',
                                        flexShrink: 1,
                                        flexGrow: 1,
                                        cursor: 'unset'
                                    }}
                                    bodyStyle={{wordBreak: 'break-all'}}
                                    hoverable
                                >
                                    <p style={cardItemStyle}>id: { node.id }</p>
                                    <p style={cardItemStyle}>addr: { node.addr }</p>
                                    <p style={cardItemStyle}>role: { node.role }</p>
                                    <p style={cardItemStyle}>slot ranges: { node.slotRanges.join(',') }</p>
                                </Card>
                            ))
                        }
                    </div>
                </>
                :
                <div className='centered-horizontally-and-vertically-parent' style={{height: '100%'}}>
                    <Spin size='large' className='centered-horizontally-and-vertically'/>
                </div>
        }
    </>);
}