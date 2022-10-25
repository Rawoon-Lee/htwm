package a306.htwm.controller;


import a306.htwm.dto.RecordRoutineDTO;
import a306.htwm.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/record")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @PostMapping("/routine")
    public ResponseEntity recordRoutine(@RequestBody RecordRoutineDTO recordRoutineDTO){
        try{
            recordService.join(recordRoutineDTO);
        }catch (RuntimeException e){
            ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }


}
