import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export const fetchRepoData = async (repoUrl) => {

  try {

    // Extract owner and repo name
    const parts = repoUrl.split("/");

    const owner = parts[3];
    const repo = parts[4];

    // Fetch repository info
    const repoData = await octokit.repos.get({
      owner,
      repo,
    });

    // Fetch README
    let readmeContent = "";

    try {

      const readme = await octokit.repos.getReadme({
        owner,
        repo,
      });

      readmeContent = Buffer.from(
        readme.data.content,
        "base64"
      ).toString("utf-8");

    } catch (error) {

      console.log("README not found");
    }

    // Fetch root files
    const contents = await octokit.repos.getContent({
      owner,
      repo,
      path: "",
    });

    const files = contents.data.map((item) => item.name);

    return {
      repoName: repoData.data.name,
      description: repoData.data.description,
      stars: repoData.data.stargazers_count,
      language: repoData.data.language,
      files,
      readmeContent,
    };

  } catch (error) {

    console.log(error);

    throw error;
  }
};