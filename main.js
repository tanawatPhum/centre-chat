let configs = require('./Layers/Presentation-Layer/Configs/configs.js')
configs.initialConfigs();

require('./Layers/Presentation-Layer/Api/message-api.js')(configs)
require('./Layers/Presentation-Layer/Api/group-api.js')(configs)