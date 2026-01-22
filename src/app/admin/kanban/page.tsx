'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, X } from 'lucide-react';
import Navbar from '../components/Navbar';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'progress' | 'done';
}

const initialTasks: Task[] = [
    { id: '1', title: '신규 상품 등록', description: 'JetBrains 최신 버전 업데이트', status: 'todo' },
    { id: '2', title: '주문 CS 처리', description: '고객 환불 요청 3건', status: 'todo' },
    { id: '3', title: '프로모션 기획', description: '2월 할인 이벤트 준비', status: 'progress' },
    { id: '4', title: '결제 시스템 점검', description: '월간 정기 점검', status: 'progress' },
    { id: '5', title: '재고 확인', description: '1월 판매 보고서', status: 'done' },
];

const columns = [
    { id: 'todo', title: '할 일', color: '#FFB547' },
    { id: 'progress', title: '진행 중', color: '#4318FF' },
    { id: 'done', title: '완료', color: '#01B574' },
];

export default function Kanban() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const moveTask = (taskId: string, newStatus: Task['status']) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
    };

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
        <div className="page-container">
            <Navbar title="칸반 보드" />

            <div className="page-content">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    minHeight: '70vh'
                }}>
                    {columns.map(column => (
                        <div
                            key={column.id}
                            style={{
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '20px',
                                boxShadow: 'var(--shadow-card)'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '4px',
                                        background: column.color
                                    }}></div>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)'
                                    }}>{column.title}</h3>
                                    <span style={{
                                        fontSize: '12px',
                                        background: 'var(--bg-input)',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {tasks.filter(t => t.status === column.id).length}
                                    </span>
                                </div>
                                <button style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-input)',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}>
                                    <Plus size={14} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {tasks
                                    .filter(task => task.status === column.id)
                                    .map(task => (
                                        <div
                                            key={task.id}
                                            style={{
                                                background: 'var(--bg-input)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '16px',
                                                cursor: 'grab'
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '8px'
                                            }}>
                                                <h4 style={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: 'var(--text-primary)'
                                                }}>{task.title}</h4>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--text-secondary)',
                                                        cursor: 'pointer',
                                                        padding: '4px'
                                                    }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <p style={{
                                                fontSize: '13px',
                                                color: 'var(--text-secondary)',
                                                marginBottom: '12px'
                                            }}>{task.description}</p>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {column.id !== 'todo' && (
                                                    <button
                                                        onClick={() => moveTask(task.id, column.id === 'progress' ? 'todo' : 'progress')}
                                                        style={{
                                                            padding: '6px 10px',
                                                            fontSize: '11px',
                                                            borderRadius: '6px',
                                                            background: 'var(--bg-card)',
                                                            color: 'var(--text-secondary)',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        ← 이전
                                                    </button>
                                                )}
                                                {column.id !== 'done' && (
                                                    <button
                                                        onClick={() => moveTask(task.id, column.id === 'todo' ? 'progress' : 'done')}
                                                        style={{
                                                            padding: '6px 10px',
                                                            fontSize: '11px',
                                                            borderRadius: '6px',
                                                            background: column.color,
                                                            color: 'white',
                                                            border: 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        다음 →
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
