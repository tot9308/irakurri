param(
  [string]$OutputPath = "supabase\seed\items.json"
)

$phonemes = @("m","k","t","l","b","p","d","n","f","g","r","rr","j","s","x","z","ts","tx","tz");
$vowels = @("a","e","i","o","u");
$items = @();

function Add-Item([string]$phoneme, [string]$level, [string]$type, [string]$grapheme) {
  $items += @{
    phoneme = $phoneme;
    level = $level;
    type = $type;
    grapheme = $grapheme;
    audio_key = $null;
    audio_source = "placeholder";
    image_key = $null;
    reviewed_at = $null;
  };
}

# 1. Presentaciones de fonema
foreach ($p in $phonemes) {
  Add-Item -phoneme $p -level "N1" -type "presentation" -grapheme $p;
}

# 2. Sílabas CV (20 por fonema)
foreach ($p in $phonemes) {
  $syls = @();
  foreach ($v in $vowels) {
    $syls += "$p$v";
  }
  $syls = $syls | Select-Object -First 20;
  foreach ($s in $syls) {
    Add-Item -phoneme $p -level "N1" -type "syllable" -grapheme $s;
  }
}

# 3. Palabras de 2 sílabas (combinar fonemas trabajados)
$words = @();
for ($i=0; $i -lt $phonemes.Count; $i++) {
  for ($j=0; $j -lt $phonemes.Count; $j++) {
    if ($i -ne $j) {
      $w = "$($phonemes[$i])$($phonemes[$j])";
      if ($w.Length -eq 2 -and -not (@($words) -contains $w)) {
        $words += $w;
      }
    }
  }
}
$words = $words | Select-Object -First 40;
foreach ($w in $words) {
  Add-Item -phoneme "m" -level "N1" -type "word" -grapheme $w;
}

# 4. Africadas N4
foreach ($p in @("ts","tx","tz")) {
  $syls = @();
  foreach ($v in $vowels) {
    $syls += "$p$v";
  }
  $syls = $syls | Select-Object -First 5;
  foreach ($s in $syls) {
    Add-Item -phoneme $p -level "N4" -type "syllable" -grapheme $s;
  }
}

# 5. Construir JSON
$json = @{
  version = "0.1.0";
  description = "Catálogo de ítems para el modo invitado (F0). Versión inicial: N1 (sílabas directas CV).";
  items = $items;
};

$json | ConvertTo-Json -Depth 3 | Set-Content -Path $OutputPath -Encoding UTF8;
Write-Output "✅ Generated $(($items).Count) items in $OutputPath";
