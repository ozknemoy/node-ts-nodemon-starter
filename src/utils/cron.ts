import DocxFile from "../bd/docx-file.model";
import * as moment from "moment";
import {Sequelize} from "sequelize-typescript";
import {join} from "path";
import {__, FILE_DIRECTORY} from "../algo/helpers";
import {FS} from "../main";
import {logger} from "./winston-logger";

const CronJob = require('cron').CronJob;

//https://crontab.guru/ sqlite 2019-07-14T14:10:49.356Z

export class Cron {
  constructor() {
    this.initDelitingOldFiles();
  }

  initDelitingOldFiles() {
    new CronJob('15,30,45,0 * * * * *', async () => {
      const to = moment()
        .subtract(5, 'day')
        .valueOf();
      const filesNeededDelete = await DocxFile.findAll({where: {
          deleted: false,
          lastEdit:{[Sequelize.Op.lt]: to}
        }});
      if(__.isFilledArray(filesNeededDelete)) {
        this.deleteFiles(filesNeededDelete);
      }
    }, null, true);
  }

  deleteFiles(files: DocxFile[]) {
    return Promise.all(
      files.map(
        file => FS.unlinkAsync(join(FILE_DIRECTORY, file.hash))
          .catch((e) => logger.error('Не удалить файл ' + e.toString()))
          // ставлю флаг удалено todo а если файл физически не удалён?
          .finally(
            () => file.update({deleted: true})
          )
      )
    ).then(
      success => {/*logger.info('Крон успешно сработал и удалил старые файлы')*/},
      err => {logger.error('Крон упал на удалении ' + err.toString())}
    )
  }
}
