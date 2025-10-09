import React, { useState, useRef, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Copy,
  Download,
  Share2,
  Users,
  Settings,
  Code2,
  Monitor,
  Smartphone,
  Tablet,
  Code,
} from "lucide-react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import CodeMirror from "codemirror";
import { initSocket } from "../Socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  const [code, setCode] = useState(
    `// Welcome to CODECAST\nfunction helloWorld() {\n  console.log("Hello, collaborative coding!");\n  return "Real-time editing made easy";\n}`
  );
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(14);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const editorRef = useRef(null);

  console.log("Room ID:", roomId);
  console.log("Username:", location.state?.username);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      const handleError = (err) => {
        console.error("Socket connection error:", err);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      };
      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));

      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
      });
      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
          console.log(`${clients} names`);
          console.log(`${username} joined`);
        }
        setActiveUsers(clients);
      });
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setActiveUsers((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    };
    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          lineWrapping: true,
        }
      );

      // store the editor instance
      editorRef.current = editor;

      // now attach event listener correctly
      editor.on("change", (instance, changes) => {
        console.log("Changes:", changes);
        const { origin } = changes;
        const code = instance.getValue();
        if (origin !== "setValue") {
          socketRef.current.emit("code-change", { roomId, code });
        }
      });
    };
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("code-change", ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
          setCode(code);
        }
      });
    }
  }, [socketRef.current]);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const languages = [
    "javascript",
    "python",
    "java",
    "cpp",
    "html",
    "css",
    "typescript",
    "php",
  ];

  const themes = ["dark", "light", "monokai", "solarized", "dracula"];

  const handleRunCode = () => {
    // Simulate code execution
    setOutput(
      "Hello, collaborative coding!\nReal-time editing made easy\n✓ Code executed successfully"
    );
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleShareRoom = () => {
    const roomId = window.location.pathname.split("/").pop();
    navigator.clipboard.writeText(`${window.location.origin}/join/${roomId}`);
    alert("Room link copied to clipboard!");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-80 bg-gray-800/30 backdrop-blur-lg border-r border-gray-700/50 flex flex-col"
      >
        {/* Room Info */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                CODECAST
              </h2>
              <p className="text-gray-400 text-sm">Room: DevTeam-001</p>
            </div>
          </div>
          <button
            onClick={handleShareRoom}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Room</span>
          </button>
        </div>

        {/* Active Users */}
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Active Users</span>
            <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
              {activeUsers.length}
            </span>
          </h3>
          <div className="space-y-3">
            {activeUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    index === 0 ? "bg-green-400" : "bg-cyan-400"
                  }`}
                />
                <span className="text-gray-300">{user.username}</span>
                {index === 0 && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="p-6 flex-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>Editor Settings</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {themes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-800/30 backdrop-blur-lg border-b border-gray-700/50 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Code2 className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-1">
              <button className="p-2 hover:bg-gray-600/50 rounded transition-colors">
                <Monitor className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-600/50 rounded transition-colors">
                <Tablet className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-600/50 rounded transition-colors">
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRunCode}
                className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Run Code</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyCode}
                className="bg-cyan-500 hover:bg-cyan-600 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-500 hover:bg-purple-600 py-2 px-4 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Editor and Output */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold">Editor</h3>
            </div>
            <div className="flex-1 p-4">
              <textarea
                id="realTimeEditor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ fontSize: `${fontSize}px` }}
                className="w-full h-full bg-gray-800/50 border border-gray-700 rounded-xl p-6 font-mono text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="w-1/3 flex flex-col border-l border-gray-700/50">
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold">Output</h3>
            </div>
            <div className="flex-1 p-4">
              <pre className="w-full h-full bg-gray-800/50 border border-gray-700 rounded-xl p-6 font-mono text-green-400 overflow-auto whitespace-pre-wrap">
                {output || "Run your code to see output here..."}
              </pre>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-800/30 backdrop-blur-lg border-t border-gray-700/50 p-3 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Language: {language}</span>
            <span>Theme: {theme}</span>
            <span>Font: {fontSize}px</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Lines: {code.split("\n").length}</span>
            <span>Connected: {activeUsers.length} users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
