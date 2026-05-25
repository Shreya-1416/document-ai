import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

import {
  Star,
  GitFork,
  Code2,
  Copy,
  Loader2,
  Download,
  FileText,
  Calendar,
  ExternalLink,
  Users,
  AlertCircle,
} from "lucide-react";

function App() {

  const [repoUrl, setRepoUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [documentation, setDocumentation] = useState("");

  const [repoData, setRepoData] = useState(null);

  // =========================
  // Generate Documentation
  // =========================

  const generateDocs = async () => {

    try {

      setLoading(true);

      const match =
        repoUrl.match(
          /github\.com\/([^/]+)\/([^/]+)/
        );

      if (!match) {

        alert("Invalid GitHub URL");

        return;
      }

      const owner = match[1];

      const repo = match[2];

      // GitHub API
      const githubResponse =
        await axios.get(

          `https://api.github.com/repos/${owner}/${repo}`
        );

      setRepoData(githubResponse.data);

      // AI Documentation API
      const response =
        await axios.post(

          "https://document-ai-backend-s6ee.onrender.com",

          {
            repoUrl,
          }
        );

      setDocumentation(
        response.data.documentation
      );

    } catch (error) {

      console.log(error);

      alert("Generation Failed");

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // Copy Documentation
  // =========================

  const copyDocumentation = () => {

    navigator.clipboard.writeText(
      documentation
    );

    alert("Documentation copied!");
  };

  // =========================
  // Download Markdown
  // =========================

  const downloadMarkdown = () => {

    const blob = new Blob(
      [documentation],

      {
        type:
          "text/markdown;charset=utf-8",
      }
    );

    saveAs(
      blob,
      "documentation.md"
    );
  };

  // =========================
  // Download DOCX
  // =========================

  const downloadDOCX = () => {

    const blob = new Blob(
      [documentation],

      {
        type:
          "application/msword",
      }
    );

    saveAs(
      blob,
      "documentation.doc"
    );
  };

  // =========================
  // Download PDF
  // =========================

  const downloadPDF = () => {

  const pdf = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  const pageWidth = 190;

  const marginLeft = 10;

  let y = 20;

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(22);

  pdf.text(
    "Generated Documentation",
    marginLeft,
    y
  );

  y += 15;

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(11);

  const lines =
    pdf.splitTextToSize(
      documentation,
      pageWidth
    );

  lines.forEach((line) => {

    if (y > 280) {

      pdf.addPage();

      y = 20;
    }

    pdf.text(
      line,
      marginLeft,
      y
    );

    y += 7;
  });

  pdf.save(
    "documentation.pdf"
  );
};

  return (

    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

      {/* Background Glow */}

      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-cyan-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-purple-500/20 blur-3xl rounded-full"></div>

      {/* Navbar */}

      <nav className="flex justify-between items-center px-5 md:px-10 py-6 relative z-10">

        <h1 className="text-3xl font-bold tracking-wide">
          DocuMind AI
        </h1>

        <a
  href="https://github.com"
  target="_blank"
  rel="noreferrer"
  className="bg-white/10 border border-white/20 h-12 w-12 rounded-xl flex items-center justify-center hover:bg-white/20 transition"
>
  <img
    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
    alt="github"
    className="w-6 h-6"
  />
</a>

      </nav>

      {/* Main */}

      <section className="relative z-10 px-4 pb-20">

        <div className="max-w-6xl mx-auto bg-white/10 border border-white/20 backdrop-blur-xl rounded-[35px] p-8 md:p-12 shadow-2xl">

          {/* Hero */}

          <div className="text-center">

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              AI-Powered

              <br />

              Documentation Generator

            </h1>

            <p className="text-gray-300 text-lg mt-6">

              Generate beautiful technical documentation
              from GitHub repositories instantly.

            </p>

          </div>

          {/* Input */}

          <div className="mt-10 flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Paste GitHub Repository URL..."
              value={repoUrl}
              onChange={(e) =>
                setRepoUrl(e.target.value)
              }
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none text-white placeholder-gray-400"
            />

            <button
              onClick={generateDocs}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 rounded-2xl px-8 py-4 font-bold transition flex items-center justify-center gap-3"
            >

              {
                loading ? (

                  <>
                    <Loader2 className="animate-spin" />

                    Generating...
                  </>

                ) : (

                  "Analyze Repo"
                )
              }

            </button>

          </div>

          {/* Repo Section */}

          {
            repoData && (

              <>

                {/* Banner */}

                <div className="mt-10 bg-[#f5f5f5] rounded-[30px] overflow-hidden shadow-2xl">

                  <div className="p-10 text-black">

                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">

                      {/* Left */}

                      <div className="flex-1 min-w-0">

                        <h2 className="text-3xl md:text-5xl font-black leading-tight break-words">

                          {repoData.full_name}

                        </h2>

                        <p className="text-gray-600 mt-6 text-lg md:text-xl leading-relaxed break-words">

                          {
                            repoData.description
                            ||
                            "No description available"
                          }

                        </p>

                      </div>

                      {/* Avatar */}

                      <img
                        src={repoData.owner.avatar_url}
                        alt="avatar"
                        className="w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover shadow-lg"
                      />

                    </div>

                    {/* Stats */}

                    <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700">

                      <div className="flex items-center gap-3">

                        <Users />

                        <div>

                          <h3 className="font-bold text-xl">
                            {repoData.subscribers_count}
                          </h3>

                          <p>Contributor</p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <AlertCircle />

                        <div>

                          <h3 className="font-bold text-xl">
                            {repoData.open_issues}
                          </h3>

                          <p>Issues</p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <Star />

                        <div>

                          <h3 className="font-bold text-xl">
                            {repoData.stargazers_count}
                          </h3>

                          <p>Stars</p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <GitFork />

                        <div>

                          <h3 className="font-bold text-xl">
                            {repoData.forks_count}
                          </h3>

                          <p>Forks</p>

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="h-4 bg-cyan-600"></div>

                </div>

                {/* Repo Info */}

                <div className="mt-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                  {/* Left */}

                  <div className="flex-1 min-w-0">

                    <h2 className="text-3xl md:text-5xl font-black break-words leading-tight">

                      {repoData.name}

                    </h2>

                    <p className="text-gray-400 mt-3 text-lg break-words">

                      {
                        repoData.description
                        ||
                        "No description available"
                      }

                    </p>

                  </div>

                  {/* Button */}

                  <a
                    href={repoData.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-cyan-500 hover:bg-cyan-400 transition rounded-2xl px-6 py-4 font-bold flex items-center justify-center gap-3 min-w-[220px]"
                  >

                    <ExternalLink size={20} />

                    Open Repository

                  </a>

                </div>

                {/* Mini Stats */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">

                  {/* Stars */}

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                      <Star size={20} />

                      <div>

                        <p className="text-sm text-gray-400">
                          Stars
                        </p>

                        <h3 className="text-2xl font-bold">
                          {repoData.stargazers_count}
                        </h3>

                      </div>

                    </div>

                  </div>

                  {/* Forks */}

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                      <GitFork size={20} />

                      <div>

                        <p className="text-sm text-gray-400">
                          Forks
                        </p>

                        <h3 className="text-2xl font-bold">
                          {repoData.forks_count}
                        </h3>

                      </div>

                    </div>

                  </div>

                  {/* Language */}

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                      <Code2 size={20} />

                      <div>

                        <p className="text-sm text-gray-400">
                          Language
                        </p>

                        <h3 className="text-2xl font-bold">
                          {repoData.language}
                        </h3>

                      </div>

                    </div>

                  </div>

                  {/* Owner */}

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                      <img
                        src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                        alt="github"
                        className="w-5 h-5"
                      />

                      <div>

                        <p className="text-sm text-gray-400">
                          Owner
                        </p>

                        <h3 className="text-2xl font-bold">
                          {repoData.owner.login}
                        </h3>

                      </div>

                    </div>

                  </div>

                  {/* Updated */}

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                      <Calendar size={20} />

                      <div>

                        <p className="text-sm text-gray-400">
                          Updated
                        </p>

                        <h3 className="text-lg font-bold">

                          {
                            new Date(
                              repoData.updated_at
                            ).toLocaleDateString()
                          }

                        </h3>

                      </div>

                    </div>

                  </div>

                </div>

              </>
            )
          }

          {/* Documentation */}

          {
            documentation && (

              <div
                id="documentation-section"
                className="mt-10 bg-[#0b1228] border border-white/10 rounded-3xl p-8"
              >

                {/* Top */}

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">

                  <div>

                    <h2 className="text-4xl md:text-5xl font-black leading-tight">

                      Generated

                      <br />

                      Documentation

                    </h2>

                    <p className="text-gray-400 mt-2">

                      AI-generated technical report

                    </p>

                  </div>

                  {/* Buttons */}

                  <div className="flex gap-3 flex-wrap items-center">

                    {/* Copy */}

                    <button
                      onClick={copyDocumentation}
                      className="h-12 min-w-[160px] bg-white/10 hover:bg-white/20 px-5 rounded-xl flex items-center justify-center gap-2 transition"
                    >

                      <Copy size={18} />

                      Copy

                    </button>

                    {/* PDF */}

                    <button
                      onClick={downloadPDF}
                      className="h-12 min-w-[160px] bg-cyan-500 hover:bg-cyan-400 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    >

                      <Download size={18} />

                      Download PDF

                    </button>

                    {/* DOCX */}

                    <button
                      onClick={downloadDOCX}
                      className="h-12 min-w-[160px] bg-purple-500 hover:bg-purple-400 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    >

                      <FileText size={18} />

                      Download DOCX

                    </button>

                    {/* Markdown */}

                    <button
                      onClick={downloadMarkdown}
                      className="h-12 min-w-[160px] bg-green-500 hover:bg-green-400 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    >

                      <FileText size={18} />

                      Download MD

                    </button>

                  </div>

                </div>

                {/* Divider */}

                <div className="border-b border-white/10 mb-8"></div>

                {/* Markdown */}

                <div className="prose prose-invert max-w-none prose-headings:text-cyan-400 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white">

                  <ReactMarkdown>

                    {documentation}

                  </ReactMarkdown>

                </div>

              </div>
            )
          }

        </div>

      </section>

    </div>
  );
}

export default App;