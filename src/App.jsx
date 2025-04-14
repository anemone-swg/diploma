import {useEffect, useState} from 'react';
import styles from './App.module.css';
import {FaPlus, FaProjectDiagram, FaTrash, FaUsers} from "react-icons/fa";
import {MdEmojiPeople} from "react-icons/md";
import {IoCheckmarkDoneOutline} from "react-icons/io5";
import {RxCross1} from "react-icons/rx";
import {PiKanban} from "react-icons/pi";

function App() {
    const [boards, setBoards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [showColumnInput, setShowColumnInput] = useState(false);

    // Эффект для закрытия модалки
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showModal && e.target.classList.contains(styles.modal)) {
                setShowModal(false);
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
        }
    };

    // Удаление доски
    const handleDeleteBoard = () => {
        setBoards([]);
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

    return (
        <div>
            <div className={styles.navbar}>
                <nav>
                    <h1 className={styles.title}><FaProjectDiagram style={{marginRight: "15px"}}
                                                                   className={styles.bigIcon}/>Планировщик проектов
                        / Kanban-доска</h1>
                    <div className={styles.menu}>
                        <div>
                            <button
                                className={styles.menuBtn}
                                onClick={boards.length === 0 ? () => setShowModal(true) : handleDeleteBoard}
                            >
                                {boards.length === 0 ? (
                                    <>
                                        <FaPlus className={styles.icon}/> Создать kanban-доску
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className={styles.icon}/> Удалить kanban-доску
                                    </>
                                )}
                            </button>
                            <button className={`${styles.menuBtn} ${boards.length === 0 ? styles.disable : ''}`}>
                                <FaUsers className={styles.icon}/>Команда
                            </button>
                        </div>
                        <div>
                            <button className={`${styles.menuBtn} ${boards.length !== 0 ? styles.disable : ''}`}>
                                <MdEmojiPeople className={styles.bigIcon}/>Присоединиться к проекту
                            </button>
                        </div>
                    </div>
                </nav>
                <hr/>
            </div>

            {/* Модальное окно создания доски */}
            {showModal && (
                <div className={`${styles.modal} ${showModal ? styles.active : ''}`}>
                    <div className={styles.modalContent}>
                        <h3><PiKanban className={styles.bigIcon}/>Создание kanban-доски</h3>
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
                            <button
                                className={styles.createConfirmBtn}
                                onClick={handleCreateBoard}
                            >
                                <IoCheckmarkDoneOutline className={styles.icon}/>Создать
                            </button>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowModal(false)}
                            >
                                <RxCross1 className={styles.icon}/>Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Отображение досок с колонками */}
            <div className={styles.boardsContainer}>
                {boards.map(board => (
                    <div key={board.id} className={styles.board}>
                        <div className={styles.boardHeader}>
                            <h3 className={styles.boardTitle}>{board.title}</h3>
                            <button
                                className={styles.addColumnBtn}
                                onClick={() => setShowColumnInput(true)}
                            >
                                <FaPlus className={styles.icon}/>Добавить столбец
                            </button>

                        </div>
                        <hr/>
                        {/* Поле ввода новой колонки */}
                        {showColumnInput && (
                            <div className={styles.columnInputContainer}>
                                <input
                                    className={styles.defaultInput}
                                    type="text"
                                    placeholder="Название столбца..."
                                    value={newColumnTitle}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreateColumn(board.id)}
                                    onChange={(e) => setNewColumnTitle(e.target.value)}
                                    autoFocus
                                />
                                <div className={styles.columnInputActions}>
                                    <button
                                        className={styles.createConfirmBtn}
                                        onClick={() => handleCreateColumn(board.id)}
                                    >
                                        <IoCheckmarkDoneOutline className={styles.icon}/>Добавить
                                    </button>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={() => {
                                            setShowColumnInput(false);
                                            setNewColumnTitle('');
                                        }}
                                    >
                                        <RxCross1 className={styles.icon}/>Отмена
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Отображение колонок */}
                        <div className={styles.columnsContainer}>
                            {board.columns.map(column => (
                                <div key={column.id} className={styles.column}>
                                    <h3 className={styles.columnTitle}>{column.title}</h3>
                                    <hr/>
                                    <div className={styles.tasksContainer}>
                                        {/* Здесь будут задачи */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;