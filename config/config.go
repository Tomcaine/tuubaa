package config

import (
	"os"

	"github.com/golobby/dotenv"
)

type Config struct {
	AppID   string `env:"APP_ID"`
	GuildID string `env:"GUILD_ID"`
}

var (
	Setting Config = Config{}
	file, _        = os.Open(".env")
)

var _ = dotenv.NewDecoder(file).Decode(&Setting)
