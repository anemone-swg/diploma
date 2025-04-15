import {useEffect, useState} from 'react';
import styles from './styles/App.module.css';
import {FaPlus, FaProjectDiagram, FaTrash, FaUsers} from "react-icons/fa";
import {MdEmojiPeople} from "react-icons/md";
import {IoCheckmarkDoneOutline} from "react-icons/io5";
import {RxCross1} from "react-icons/rx";
import {PiKanban} from "react-icons/pi";
import KanbanBoardSection from "./features/kanban/components/KanbanBoardSection.jsx";
import TeamSection from "./features/team/components/TeamSection.jsx";
import DefaultBtn from "./components/ui/DefaultBtn.jsx";
import classNames from "classnames";

function App() {
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [showColumnInput, setShowColumnInput] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Эффект для закрытия модалки
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.classList.contains(styles.modal)) {
                setShowModal(false);
                setNewBoardTitle('');
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showModal]);

    // Создание доски
    const handleCreateBoard = () => {
        if (newBoardTitle.trim() && boards.length === 0) {
            const newBoard = {
                id: Date.now(),
                title: newBoardTitle,
                columns: [],
            };
            setBoards([newBoard]);
            setNewBoardTitle('');
            setShowModal(false);
            setActiveSection('kanban');
        }
    };

    // Удаление доски
    const handleDeleteBoard = () => {
        if (window.confirm('Вы уверены, что хотите полностью удалить доску? Все данные будут потеряны.')) {
            setBoards([]);
            setActiveSection('');
        }
    };

    // Создание колонки
    const handleCreateColumn = (boardId) => {
        if (newColumnTitle.trim()) {
            setBoards(boards.map(board => {
                if (board.id === boardId) {
                    return {
                        ...board,
                        columns: [...board.columns, {
                            id: Date.now(),
                            title: newColumnTitle,
                            tasks: []
                        }]
                    }
                }
                return board;
            }));
            setNewColumnTitle('');
            setShowColumnInput(false);
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'kanban':
                return (
                    <KanbanBoardSection
                        boards={boards}
                        showColumnInput={showColumnInput}
                        newColumnTitle={newColumnTitle}
                        setShowColumnInput={setShowColumnInput}
                        setNewColumnTitle={setNewColumnTitle}
                        handleCreateColumn={handleCreateColumn}
                    />
                );

            case 'team':
                return <TeamSection/>;

            default:
                return (
                    <div className={styles.defaultSection}>
                        <h3>Создайте kanban-доску или присоединитесь к существующему проекту.</h3>
                    </div>
                );
        }
    };

    return (
        <div>
            <div className={styles.navbar}>
                <nav>
                    <h1 className={styles.title}>
                        <FaProjectDiagram style={{marginRight: "15px"}} className={styles.icon}/>
                        Планировщик проектов / Kanban-доска
                    </h1>
                    <div className={styles.menu}>
                        <div>
                            <DefaultBtn
                                icon={boards.length === 0 ? FaPlus : PiKanban}
                                active={activeSection === 'kanban'}
                                onClick={() => {
                                    if (boards.length > 0) setActiveSection('kanban');
                                    else setShowModal(true);
                                }}
                                disabled={false}
                                className={activeSection === 'kanban' ? styles.activeDefaultBtn : ''}
                            >
                                {boards.length === 0 ? 'Создать kanban-доску' : 'Kanban-доска'}
                            </DefaultBtn>

                            <DefaultBtn
                                icon={FaUsers}
                                active={activeSection === 'team'}
                                onClick={() => setActiveSection('team')}
                                disabled={boards.length === 0}
                                className={classNames(
                                    {[styles.disable]: boards.length === 0},
                                    {[styles.activeDefaultBtn]: activeSection === 'team'}
                                )}
                            >
                                Команда
                            </DefaultBtn>
                        </div>
                        <div>
                            <DefaultBtn
                                icon={boards.length === 0 ? MdEmojiPeople : FaTrash}
                                onClick={boards.length === 0 ? undefined : handleDeleteBoard}
                                disabled={false}
                            >
                                {boards.length === 0 ? 'Присоединиться к проекту' : 'Удалить kanban-доску'}
                            </DefaultBtn>
                        </div>
                    </div>
                </nav>
                <hr/>
            </div>

            {/* Модальное окно создания доски */}
            <div className={`${styles.modal} ${showModal ? styles.activeModal : ''}`}>
                {showModal && (
                    <div className={styles.modalContent}>
                        <h3><PiKanban className={styles.icon}/>Создание kanban-доски</h3>
                        <input
                            className={styles.defaultInput}
                            type="text"
                            placeholder="Название..."
                            value={newBoardTitle}
                            onChange={(e) => setNewBoardTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateBoard()}
                            autoFocus
                        />
                        <div className={styles.modalActions}>
                            <DefaultBtn
                                variant="createConfirmBtn"
                                icon={IoCheckmarkDoneOutline}
                                onClick={handleCreateBoard}
                            >
                                Создать
                            </DefaultBtn>

                            <DefaultBtn
                                variant="cancelBtn"
                                icon={RxCross1}
                                onClick={() => {
                                    setShowModal(false);
                                    setNewBoardTitle('')
                                }}
                            >
                                Отмена
                            </DefaultBtn>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.contentContainer}>
                {renderContent()}
            </div>
        </div>
    );
}

export default App;