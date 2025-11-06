import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CLASH_API_KEY = process.env.CLASH_API_KEY; // stored in Render env vars

app.get("/player/:tag", async (req, res) => {
  try {
    const tag = req.params.tag.replace("#", "%23");
    const response = await fetch(`https://api.clashofclans.com/v1/players/${tag}`, {
      headers: { Authorization: `Bearer ${CLASH_API_KEY}` },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Player not found or invalid tag" });
    }

    const data = await response.json();
    res.json({
      name: data.name,
      tag: data.tag,
      townHallLevel: data.townHallLevel,
      expLevel: data.expLevel,
      clan: data.clan ? data.clan.name : "No clan",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
