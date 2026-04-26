import re

with open('.trae/documents/PRD.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace 11 -> 10 in general text
content = content.replace('11个核心视觉要素', '10个核心视觉要素')
content = content.replace('3. 11个视觉要素详细定义', '3. 10个视觉要素详细定义')
content = content.replace('管理11个视觉要素', '管理10个视觉要素')
content = content.replace('11个视觉要素的快速跳转导航', '10个视觉要素的快速跳转导航')
content = content.replace('11个要素的组织方式', '10个要素的组织方式')
content = content.replace('视觉组（前8个）：材质、调色、表情、环境、服装、构图、妆造、肢体', '视觉组（前7个）：材质、调色、表情、服装、构图、妆造、肢体')
content = content.replace('依次配置11个视觉要素', '依次配置10个视觉要素')
content = content.replace('11个视觉要素自动组装', '10个视觉要素自动组装')
content = content.replace('视觉风格：[材质], [调色], [表情], [环境], [服装], [构图], [妆造], [肢体]', '视觉风格：[材质], [调色], [表情], [服装], [构图], [妆造], [肢体]')
content = content.replace('包含11个视觉要素', '包含10个视觉要素')
content = content.replace('影响视频视觉风格的11个维度', '影响视频视觉风格的10个维度')

# 2. Update Table 3.1
table_old = """| 1    | 材质   | 视觉   | 选择/上传 | 物体表面质感  |
| 2    | 调色   | 视觉   | 色板/预设 | 整体色彩风格  |
| 3    | 表情   | 视觉   | 选择/描述 | 人物面部表情  |
| 4    | 环境   | 视觉   | 选择/描述 | 场景背景设定  |
| 5    | 服装   | 视觉   | 选择/上传 | 人物穿着风格  |
| 6    | 构图   | 视觉   | 选择/图示 | 画面布局方式  |
| 7    | 妆造   | 视觉   | 选择/描述 | 化妆造型风格  |
| 8    | 肢体   | 视觉   | 选择/描述 | 肢体动作姿态  |
| 9    | 台词节奏 | 音频   | 参数调节  | 语音语速语调  |
| 10   | 剪辑节奏 | 时序   | 参数调节  | 镜头切换速度  |
| 11   | 音效   | 音频   | 选择/上传 | 背景音乐/音效 |"""

table_new = """| 1    | 材质   | 视觉   | 选择/上传/自定义 | 物体表面质感  |
| 2    | 调色   | 视觉   | 色板/预设/自定义 | 整体色彩风格  |
| 3    | 表情   | 视觉   | 选择/描述/自定义 | 人物面部表情  |
| 4    | 服装   | 视觉   | 选择/上传/自定义 | 人物穿着风格  |
| 5    | 构图   | 视觉   | 选择/图示/自定义 | 画面布局方式  |
| 6    | 妆造   | 视觉   | 选择/描述/自定义 | 化妆造型风格  |
| 7    | 肢体   | 视觉   | 选择/描述/自定义 | 肢体动作姿态  |
| 8    | 台词节奏 | 音频   | 参数调节/自定义 | 语音语速语调  |
| 9    | 剪辑节奏 | 时序   | 参数调节/自定义 | 镜头切换速度  |
| 10   | 音效   | 音频   | 选择/上传/自定义 | 背景音乐/音效 |"""

content = content.replace(table_old, table_new)

# 3. Remove Environment section and renumber
# Remove "#### 3.2.4 环境 (Environment)..." up to "#### 3.2.5 服装 (Costume)"
env_section_pattern = re.compile(r'#### 3\.2\.4 环境 \(Environment\).*?(?=#### 3\.2\.5 服装 \(Costume\))', re.DOTALL)
content = re.sub(env_section_pattern, '', content)

# Renumber the remaining sections 3.2.5 to 3.2.11 -> 3.2.4 to 3.2.10
content = content.replace('#### 3.2.5 服装', '#### 3.2.4 服装')
content = content.replace('#### 3.2.6 构图', '#### 3.2.5 构图')
content = content.replace('#### 3.2.7 妆造', '#### 3.2.6 妆造')
content = content.replace('#### 3.2.8 肢体', '#### 3.2.7 肢体')
content = content.replace('#### 3.2.9 台词节奏', '#### 3.2.8 台词节奏')
content = content.replace('#### 3.2.10 剪辑节奏', '#### 3.2.9 剪辑节奏')
content = content.replace('#### 3.2.11 音效', '#### 3.2.10 音效')

# 4. Add "自定义" to all elements
elements = ['材质 (Material)', '调色 (Color Grading)', '表情 (Expression)', '服装 (Costume)', '构图 (Composition)', '妆造 (Makeup)', '肢体 (Gesture)', '台词节奏 (Dialogue Rhythm)', '剪辑节奏 (Editing Rhythm)', '音效 (Sound Effects)']

for el in elements:
    # Find the bullet list under "* **录入方式**：" and append the custom bullet before "* **展示形式**："
    # Use regex
    pattern = r'(\* \*\*录入方式\*\*：\n\n(?:.*?\n)+?)(?=\n\* \*\*展示形式\*\*：)'
    # We need to target each section specifically
    # Let's split by section headers, modify, and rejoin
    pass

# A simpler way to add "自定义": 
# Replace `* **展示形式**：` with `  * 自定义：支持完全自定义输入或参数配置\n\n* **展示形式**：` globally within the 3.2.x sections.
# Wait, some already have `自定义上传` or `自定义色板`. But the requirement says "每一个要素的录入都需要增加自定义". Adding a generic custom input option works.
content = content.replace('* **展示形式**：', '  * 自定义：支持完全自定义输入或参数配置\n\n* **展示形式**：')

# 5. Modify 剪辑节奏 (Shot duration)
content = content.replace('镜头时长：短(2-3s) / 中(4-6s) / 长(7-10s)', '镜头时长预设：15s / 30s / 45s / 60s')

# 6. Add "声音材质" to "台词节奏"
content = content.replace('语调风格：沉稳专业、热情活力、亲切温和、权威可信', '语调风格：沉稳专业、热情活力、亲切温和、权威可信\n\n  * 声音材质：预设/自定义声音材质（如：磁性、清脆、沙哑等）')

# 7. Remove "音效类型" from "音效"
content = content.replace('  * 音效类型：环境音、强调音、过渡音\n\n', '')

# 8. Update JSON example in 7.2.2
json_env_old = """  "expression": {
    "preset": "confident_smile",
    "intensity": 75,
    "description": "自信且亲和"
  },
  "environment": {
    "category": "indoor",
    "preset": "office",
    "description": "现代简约办公室"
  },
  "costume": {"""
json_env_new = """  "expression": {
    "preset": "confident_smile",
    "intensity": 75,
    "description": "自信且亲和"
  },
  "costume": {"""
content = content.replace(json_env_old, json_env_new)

content = content.replace('"sound_types": ["ambient", "emphasis"],\n', '')

with open('.trae/documents/PRD.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("Update complete")
