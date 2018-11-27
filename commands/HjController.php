<?php

namespace app\commands;

use yii\console\Controller;
use SqlFormatter;

/**
 * Hejiang Toolkit
 */
class HjController extends Controller
{
    /**
     * Default command.
     */
    public function actionIndex()
    {
        echo 'please specify a command you wanna run.';
    }

    /**
     * Pack sql querys as upgrade script format.
     */
    public function actionFormatSql($message)
    {
        $sql = SqlFormatter::compress($message);
        $sqlList = SqlFormatter::splitQuery($sql);
        if(!$sqlList){
            throw new \Exception('no sql given');
        }
        echo '{' . PHP_EOL;
        foreach($sqlList as $sql){
            $sql = trim($sql);
            echo "\thj_pdo_run(\"$sql\");" . PHP_EOL;
        }
        echo '}' . PHP_EOL;
    }
}
